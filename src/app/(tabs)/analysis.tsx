import AppHeader from '@/components/ui/appHeader';
import { createStyles, StylesType } from '@/constants/global-styles';
import { useAppTheme } from '@/hooks/use-app-theme';
import { BinderCallItem, BinderStatus } from '@/types';
import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';


interface Props {
  styles: StylesType;
}

interface BinderCallItemViewProps {
  item: BinderCallItem;
  index: number;
  total: number;
  styles: StylesType;
}



export default function DeepAnalysisScreen() {

  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [performanceData, setPerformanceData] = useState(7);
  const [fps, setFps] = useState(52);

  const [binderCallItemList, setBinderCallItemList] = useState<BinderCallItem[]>([
    { id: '1', name: 'IActivityManager.getRunni...', sub: 'Binder:1024_3', time: '4', status: BinderStatus.ACTIVE },
    { id: '2', name: 'IWindowManager.relayout', sub: 'Binder:1024_5', time: '4.7', status: BinderStatus.ACTIVE },
    { id: '3', name: 'IPackageManager.queryIntent', sub: 'Binder:1024_1', time: '7', status: BinderStatus.IDLE },]);


  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>

      <AppHeader
        title="Deep Analysis"
        subtitle="900ms sampling"
        fps={fps}
        cpu={performanceData}
      />

      {/* 2. 圖表卡片 */}
      <View style={[styles.card, { marginTop: 16 }]}>

        {/* 圖表 Header */}
        <View style={styles.rowBetween}>
          <View style={styles.rowCenter}>
            <View style={[styles.rowCenter, { marginEnd: 16 }]}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary, marginEnd: 6 }} />
              <Text style={styles.TextSecordary}>CPU  12%</Text>
            </View>
            <View style={styles.rowCenter}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.secondary, marginEnd: 6 }} />
              <Text style={styles.TextSecordary}>MEM  56%</Text>
            </View>
          </View>
          <Text style={styles.TextSecordarySub}>0-100%</Text>
        </View>

        {/* 模擬折線圖區域 */}
        <View style={{ height: 120, justifyContent: 'space-between', paddingVertical: 16, marginTop: 12 }}>
          <View style={styles.dividingLine} />
          {/* 虛線模擬（藍色折線） */}
          <View style={{ height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: '#60A5FA' }} />
          <View style={styles.dividingLine} />
          {/* 實線模擬（綠色折線） */}
          <View style={{ height: 2, backgroundColor: '#4ADE80' }} />
        </View>
      </View>

      {/* 3. Binder Calls 列表卡片 */}
      <View style={[styles.card, { marginTop: 16 }]}>
        {/* 標題 */}
        <View style={[styles.rowCenter, { marginBottom: 16 }]}>
          <Text style={styles.TextSecordary}>Binder Calls</Text>
        </View>

        {/* 列表內容 */}
        {binderCallItemList.map((item, index) => (
          <BinderCallItemView
            key={item.id}
            item={item}
            index={index}
            total={binderCallItemList.length}
            styles={styles}
          />
        ))}
      </View>

    </ScrollView>
  );
}


const BinderCallItemView = ({ item, index, total, styles }: BinderCallItemViewProps) => {

  const statusStyleMap: Record<BinderStatus, { color: string; bg: string }> = {
    [BinderStatus.ACTIVE]: {
      color: '#4ADE80',
      bg: '#143823', // 深綠背景
    },
    [BinderStatus.IDLE]: {
      color: '#9CA3AF',
      bg: '#2A2F35', // 深灰背景
    },
    [BinderStatus.BLOCKED]: {
      color: '#FF6B6B', // 亮紅文字
      bg: '#3B1717', // 深紅背景
    },
  };


  return (
    <>
      <View style={[styles.rowBetween, { paddingVertical: 10 }]}>
        {/* 左側名稱與次要資訊 */}
        <View>
          <Text style={styles.TextSecordary}>{item.name}</Text>
          <Text style={styles.TextSecordarySub}>{item.sub}</Text>
        </View>

        {/* 右側時間與 Status Badge */}
        <View style={styles.rowCenter}>
          <Text style={[styles.TextSecordarySub, { marginEnd: 10 }]}>{item.time} ms</Text>

          <View
            style={{
              backgroundColor: statusStyleMap[item.status].bg,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
            }}
          >
            <Text style={[styles.TextXSmall, { color: statusStyleMap[item.status].color }]}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>

      {/* 自訂分隔線（最後一項自動隱藏） */}
      {index !== total - 1 && <View style={styles.dividingLine} />}
    </>
  );
}