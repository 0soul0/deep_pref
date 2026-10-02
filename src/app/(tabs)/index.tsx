import { ThemedText } from '@/components/themed-text';
import AppHeader from '@/components/ui/appHeader';
import { CustomProgressBar } from '@/components/ui/customProgressBar';
import { createStyles, StylesType } from '@/constants/global-styles';
import { useAppTheme } from '@/hooks/use-app-theme';
import { EfficacyItem, ProcessItem } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as Device from 'expo-device';
import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { NativeModules, Platform, ScrollView, Text, View } from 'react-native';


function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}


// 2. 定義 Component Props 型別
type EfficacyCardProps = {
  styles: StylesType;
  item: EfficacyItem;
}

// 取得我們剛剛寫的原生模組
const { DeepPerfModule } = NativeModules;

export default function DashboardScreen() {

  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);


  const [efficacyList, setEfficacyList] = useState<EfficacyItem[]>([])
  const [processList, setProcessList] = useState<ProcessItem[]>([])

  const [cpu, setCpu] = useState(0);
  const [fps, setFps] = useState(0);

  const handleEfficacy = async () => {
    try {

      const jsonString = await DeepPerfModule.startMonitoring();

      // data class PerfMetrics(
      //     val pid: Int,               // 行程 ID
      //     val cpuUsage: Float,        // CPU 使用率 (%)
      //     val memoryPssKb: Long,      // PSS 記憶體 (KB)
      //     val rssMemoryKb: Long,      // RSS 實體記憶體 (KB)
      //     val threadCount: Int,       // 執行緒數量
      //     val fps: Float,              // 當前畫面幀率 (FPS)
      //     val threads: List<ThreadPerfInfo>
      // )

      const metrics = JSON.parse(jsonString);

      setFps(metrics.fps)
      setCpu(metrics.cpuUsage)

      setEfficacyList(
        [
          { name: 'fps', value: metrics.fps, unit: 'fps', icon: 'speedometer-outline', iconColor: theme.colors.primary },
          { name: 'cpu', value: metrics.cpuUsage, unit: '%', icon: 'hardware-chip', iconColor: theme.colors.accentWarning },
          { name: 'memory', value: metrics.memoryPssKb, unit: 'MB', icon: 'battery-full', iconColor: theme.colors.secondary }
        ]
      )

      setProcessList(
        metrics.threads.map((item: any) => ({
          name: item.name,
          pid: item.tid,
          cpuPercentage: item.cpuTimeMs,
          memoryUsageMB: item.stackMemoryKb,
          state: item.state,
        })) as ProcessItem[]
      )

      console.log(metrics)
    } catch (error) {
      console.error('取得指標失敗:', error);
    }
  };


  useEffect(() => {
    handleEfficacy()
  }, [])



  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>


      <AppHeader
        title="System Pulse"
        subtitle="Live monitor"
        fps={fps}
        cpu={cpu}
      />


      <View style={[styles.rowBetween, { marginTop: 16, gap: 20 }]}>

        {efficacyList && efficacyList.map((item, idx) => (
          <EfficacyCard
            key={item.name}
            styles={styles}
            item={item}
          />
        ))}

      </View>

      <View style={[styles.card, { marginTop: 16, marginBottom: 35 }]}>
        <View style={styles.rowBetween}>
          <Text style={styles.TextSecordary}>Top Processes</Text>
          <Text style={styles.TextSecordarySub}>1536MB budget</Text>
        </View>

        <View style={{ flex: 1 }}>
          {processList.map((item, index) => (
            <ProcessItemView total={processList.length} index={index} key={item.pid} styles={styles} item={item} />
          ))}
        </View>

      </View>

    </ScrollView >
  )

}


const ProcessItemView = ({ total, index, styles, item }: { total: number, index: number, styles: StylesType, item: ProcessItem }) => {
  return (
    <View>
      {/* Name and PID */}
      <View style={[styles.rowBetween, { marginTop: 16 }]}>
        <Text style={styles.TextSecordary}>{item.name}</Text>
        <Text style={styles.TextSecordary}>PID: {item.pid}</Text>
      </View>

      {/* 檢查是否有 CPU 數據，沒有就給預設 0 */}
      <View style={[styles.rowCenter, { marginTop: 16 }]}>
        <CustomProgressBar
          style={styles.processBarProgress}
          progress={(item.cpuPercentage ?? 0) / 100}
          progressColor={styles.processBarPrimary.color}
        />
        <Text style={[styles.TextSecordarySub, { marginStart: 16 }]}>
          CPU: {item.cpuPercentage ?? 0}%
        </Text>
      </View>

      {/* 檢查是否有 Memory 數據，沒有就給預設 0 */}
      <View style={[styles.rowCenter, { marginTop: 8 }]}>
        <CustomProgressBar
          style={styles.processBarProgress}
          progress={(item.memoryUsageMB ?? 0) / 1024}
          progressColor={styles.processBarSecondary.color}
        />
        <Text style={[styles.TextSecordarySub, { marginStart: 16 }]}>
          {item.memoryUsageMB ?? 0} MB
        </Text>
      </View>

      {/* Dividing line */}
      {total !== index + 1 && (
        <View style={[styles.dividingLine, { marginTop: 8 }]} />
      )}
    </View>
  )
}


const EfficacyCard = ({ styles, item }: EfficacyCardProps) => {

  const iconStr = (item.icon as ComponentProps<typeof Ionicons>['name']) ?? 'help-circle-outline'

  return (
    <View style={[styles.card, { flex: 1 }]}>

      <View style={[styles.rowBetween, { paddingBottom: 10 }]}>
        <Text style={styles.TextSecordarySub}>{item.name}</Text>
        <Ionicons name={iconStr} style={[styles.iconSizeLg, { marginStart: 16, }]} color={item.iconColor} />
      </View>

      <View style={[styles.rowCenter, { paddingBottom: 6 }]}>
        <Text style={styles.TextXl}>{item.value}</Text>
        <Text style={[styles.TextSecordarySub, { marginStart: 8, marginBottom: 2, alignSelf: 'flex-end' }]}>{item.unit}</Text>
      </View>
    </View>

  );
}
