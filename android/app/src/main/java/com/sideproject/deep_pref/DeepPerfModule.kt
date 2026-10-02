package com.sideproject.deep_pref

import com.facebook.react.bridge.*
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.collectLatest
import com.google.gson.Gson

class DeepPerfModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {


    private lateinit var perfEngine: DeepPerfEngine

    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private var perfJob: Job? = null

    override fun getName(): String {
        return "DeepPerfModule"
    }


    @ReactMethod
    fun startMonitoring(promise: Promise) {
        perfJob?.cancel()
        perfEngine = DeepPerfEngine(reactContext, reactContext.packageName)
        perfJob = scope.launch {
            perfEngine.startMonitoring(intervalMs = 1000L).collectLatest { metrics ->
                val jsonString = Gson().toJson(metrics)
                promise.resolve(jsonString)
            }
        }
    }

    @ReactMethod
    fun stopMonitoring() {
        perfJob?.cancel()
    }


}