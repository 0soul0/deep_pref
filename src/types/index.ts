
export enum BinderStatus {
    ACTIVE = 'ACTIVE',
    IDLE = 'IDLE',
    BLOCKED = 'BLOCKED',
}

export type OptionItem = {
    label: string;
    value: string; // 建議可加上 number 增加彈性
    pid: number
}

export type EfficacyItem = {
    name: string;
    value: number;
    unit: string;
    icon: string;
    iconColor: string;
}

export type ProcessItem = {
    pid: string;
    name: string;
    thread: string;
    cpuPercentage: number;
    memoryUsageMB: number;
    state: string;
};

// data class ThreadPerfInfo(
//     val tid: Int,           // 執行緒 ID (TID)
//     val name: String,       // 執行緒名稱 (例如 main, Binder:xxxx, DefaultDispatcher-worker)
//     val state: String,      // 執行緒狀態 (R: 運行中, S: 睡眠/等待等)
//     val cpuTimeMs: Long,    // 累計耗費的 CPU 時間 (毫秒)
//     val stackMemoryKb: Long // 該執行緒的 Stack 記憶體大小 (KB)
// )

export type BinderCallItem = {
    id: string;
    name: string;
    sub: string;
    time: string;
    status: BinderStatus;
}