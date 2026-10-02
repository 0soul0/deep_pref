package com.sideproject.deep_pref

import android.app.ActivityManager
import android.content.Context
import android.view.Choreographer
import com.sideproject.deep_pref.model.PerfMetrics
import com.sideproject.deep_pref.model.ThreadPerfInfo
import kotlinx.coroutines.currentCoroutineContext
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.isActive
import java.io.File
import java.io.RandomAccessFile
import kotlin.collections.contains
import kotlin.time.Duration.Companion.milliseconds

class DeepPerfEngine(context: Context, private val targetPackageName: String) {

    private val activityManager = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager

    // CPU 計算的歷史基準點
    private var lastCpuTime: Long = 0
    private var lastAppCpuTime: Long = 0

    /**
     * 啟動持續監控資料流
     * @param intervalMs 收集頻率（預設每 1 秒一次）
     */
    fun startMonitoring(intervalMs: Long = 1000L): Flow<PerfMetrics?> = flow {
        val fpsTracker = FpsTracker()
        // 注意：FPS 只能追蹤當前正在畫面的 App，若目標是背景 App 則無法計算 FPS
        fpsTracker.start()

        try {
            while (currentCoroutineContext().isActive) {
                // 1. 根據 packageName 動態取得目標 App 的 PID
                val targetPid = findTargetPid()
                if (targetPid == null) {
                    // 如果找不到該 App 的行程（可能未啟動），發送 null 或跳過
                    emit(null)
                    delay(intervalMs.milliseconds)
                    continue
                }

                // 2. 收集 PSS 記憶體
                var pssKb = 0L
                val memoryInfoArray = activityManager.getProcessMemoryInfo(intArrayOf(targetPid))
                if (memoryInfoArray.isNotEmpty()) {
                    pssKb = memoryInfoArray[0].totalPss.toLong()
                }

                // 3. 從 /proc/[pid] 收集 RSS 記憶體與執行緒總數
                val rssKb = readRSSMemory(targetPid)
                val threadCount = readThreadCount(targetPid)

                // 4. 計算總體 CPU 使用率
                val cpuUsage = calculateCpuUsage(targetPid)

                // 5. 取得當前 FPS
                val currentFps = fpsTracker.currentFps

                // 6. 掃描該 PID 的所有子執行緒詳細效能
                val threadList = getAllThreadsPerformance(targetPid)

                // 7. 組合完整的效能報告
                val metrics = PerfMetrics(
                    pid = targetPid,
                    cpuUsage = cpuUsage,
                    memoryPssKb = pssKb,
                    rssMemoryKb = rssKb,
                    threadCount = threadCount,
                    fps = currentFps,
                    threads = threadList
                )

                emit(metrics)
                delay(intervalMs.milliseconds)
            }
        } finally {
            fpsTracker.stop()
        }
    }

    private fun findTargetPid(): Int? {
        val runningProcesses = activityManager.runningAppProcesses ?: return null
        for (process in runningProcesses) {
            val pkgList = process.pkgList
            val isMatch = (pkgList != null && pkgList.contains(targetPackageName)) ||
                    process.processName.startsWith(targetPackageName)
            if (isMatch) {
                return process.pid
            }
        }
        return null
    }

    private fun readRSSMemory(pid: Int): Long {
        var rssKb = 0L
        try {
            val statmFile = RandomAccessFile("/proc/$pid/statm", "r")
            val statmParts = statmFile.readLine().split(" ")
            statmFile.close()
            if (statmParts.size > 1) {
                rssKb = statmParts[1].toLong() * 4
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return rssKb
    }

    private fun readThreadCount(pid: Int): Int {
        var threadCount = 0
        try {
            val statusFile = RandomAccessFile("/proc/$pid/status", "r")
            var line: String? = statusFile.readLine()
            while (line != null) {
                if (line.startsWith("Threads:")) {
                    threadCount = line.replace("Threads:", "").trim().toIntOrNull() ?: 0
                    break
                }
                line = statusFile.readLine()
            }
            statusFile.close()
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return threadCount
    }

    private fun calculateCpuUsage(pid: Int): Float {
        try {
            val reader = RandomAccessFile("/proc/stat", "r")
            val cpuLine = reader.readLine()
            reader.close()

            val toks = cpuLine.split("\\s+".toRegex())
            val totalCpuTime = toks[1].toLong() + toks[2].toLong() + toks[3].toLong() +
                    toks[4].toLong() + toks[5].toLong() + toks[6].toLong() + toks[7].toLong()

            val appReader = RandomAccessFile("/proc/$pid/stat", "r")
            val appLine = appReader.readLine()
            appReader.close()
            val appToks = appLine.split("\\s+".toRegex())
            val appCpuTime = appToks[13].toLong() + appToks[14].toLong() // utime + stime

            if (lastCpuTime != 0L) {
                val totalCpuDiff = totalCpuTime - lastCpuTime
                val appCpuDiff = appCpuTime - lastAppCpuTime
                if (totalCpuDiff > 0) {
                    lastCpuTime = totalCpuTime
                    lastAppCpuTime = appCpuTime
                    return (appCpuDiff.toFloat() / totalCpuDiff.toFloat()) * 100f
                }
            }
            lastCpuTime = totalCpuTime
            lastAppCpuTime = appCpuTime
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return 0f
    }

    private fun getAllThreadsPerformance(pid: Int): List<ThreadPerfInfo> {
        val threadList = mutableListOf<ThreadPerfInfo>()
        val taskDir = File("/proc/$pid/task")
        if (!taskDir.exists() || !taskDir.isDirectory) return threadList

        val taskFiles = taskDir.listFiles() ?: return threadList

        for (taskFile in taskFiles) {
            val tidStr = taskFile.name
            val tid = tidStr.toIntOrNull() ?: continue

            val name = try {
                File(taskFile, "comm").readText().trim()
            } catch (_: Exception) {
                "Unknown"
            }

            var state = "Unknown"
            var cpuTimeMs = 0L
            try {
                val statContent = File(taskFile, "stat").readText()
                val parts = statContent.split(" ")
                if (parts.size > 14) {
                    state = parts[2]
                    val utime = parts[13].toLong()
                    val stime = parts[14].toLong()
                    cpuTimeMs = (utime + stime) * 10
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }

            var stackMemoryKb = 0L
            try {
                val statusFile = File(taskFile, "status")
                if (statusFile.exists()) {
                    statusFile.forEachLine { line ->
                        if (line.startsWith("VmStk:")) {
                            val parts = line.split("\\s+".toRegex())
                            if (parts.size >= 2) {
                                stackMemoryKb = parts[1].toLongOrNull() ?: 0L
                            }
                        }
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }

            threadList.add(
                ThreadPerfInfo(
                    tid = tid,
                    name = name,
                    state = state,
                    cpuTimeMs = cpuTimeMs,
                    stackMemoryKb = stackMemoryKb
                )
            )
        }

        return threadList.sortedByDescending { it.cpuTimeMs }
    }

    private class FpsTracker {
        private var frameCount = 0
        private var lastTimeNanos = 0L
        var currentFps = 0f
            private set

        private val frameCallback = object : Choreographer.FrameCallback {
            override fun doFrame(frameTimeNanos: Long) {
                if (lastTimeNanos == 0L) {
                    lastTimeNanos = frameTimeNanos
                } else {
                    val elapsed = frameTimeNanos - lastTimeNanos
                    frameCount++
                    if (elapsed >= 1_000_000_000L) {
                        currentFps = (frameCount * 1_000_000_000L).toFloat() / elapsed
                        frameCount = 0
                        lastTimeNanos = frameTimeNanos
                    }
                }
                Choreographer.getInstance().postFrameCallback(this)
            }
        }

        fun start() {
            Choreographer.getInstance().postFrameCallback(frameCallback)
        }

        fun stop() {
            Choreographer.getInstance().removeFrameCallback(frameCallback)
        }
    }
}