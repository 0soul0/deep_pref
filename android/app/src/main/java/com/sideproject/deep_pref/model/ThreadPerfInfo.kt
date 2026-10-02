package com.sideproject.deep_pref.model

data class ThreadPerfInfo(
    val tid: Int,           // 執行緒 ID (TID)
    val name: String,       // 執行緒名稱 (例如 main, Binder:xxxx, DefaultDispatcher-worker)
    val state: String,      // 執行緒狀態 (R: 運行中, S: 睡眠/等待等)
    val cpuTimeMs: Long,    // 累計耗費的 CPU 時間 (毫秒)
    val stackMemoryKb: Long // 該執行緒的 Stack 記憶體大小 (KB)
)