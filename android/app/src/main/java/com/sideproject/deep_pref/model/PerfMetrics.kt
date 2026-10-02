package com.sideproject.deep_pref.model

data class PerfMetrics(
    val pid: Int,               // 行程 ID
    val cpuUsage: Float,        // CPU 使用率 (%)
    val memoryPssKb: Long,      // PSS 記憶體 (KB)
    val rssMemoryKb: Long,      // RSS 實體記憶體 (KB)
    val threadCount: Int,       // 執行緒數量
    val fps: Float,              // 當前畫面幀率 (FPS)
    val threads: List<ThreadPerfInfo>
)