import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { 
  getAllLogs, 
  getDailyGoalsWithCheck, 
  toggleGoalCheck, 
  getGrowthStats,
  getCurrentStreak,
  WorkLog 
} from '../database/db';
import { DESIGN } from '../theme/design';

const MOOD_MAP: any = {
  best: '🔥',
  good: '✨',
  normal: '☁️',
  hard: '🌊',
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [dailyGoals, setDailyGoals] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState({ total: 0, completed: 0, rate: 0 });
  
  const today = new Date().toISOString().split('T')[0];

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = () => {
    setLogs(getAllLogs());
    setDailyGoals(getDailyGoalsWithCheck(today));
    setStreak(getCurrentStreak());
    setStats(getGrowthStats(today));
  };

  const handleToggleGoal = (goalId: number, currentDone: number) => {
    toggleGoalCheck(goalId, today, currentDone === 1 ? 0 : 1);
    loadData();
  };

  const renderInsight = ({ item }: { item: WorkLog }) => (
    <TouchableOpacity 
      style={styles.insightItem}
      onPress={() => navigation.navigate('Detail', { log: item })}
      activeOpacity={0.6}
    >
      <View style={styles.insightHeader}>
        <Text style={styles.insightDate}>{item.date.split('-').slice(1).join(' / ')}</Text>
        {item.mood && <Text style={styles.insightMood}>{MOOD_MAP[item.mood]}</Text>}
      </View>
      <Text style={styles.insightTitle} numberOfLines={1}>{item.title}</Text>
      {item.daily_summary && (
        <Text style={styles.insightSummary} numberOfLines={1}>"{item.daily_summary}"</Text>
      )}
      <View style={styles.tagRow}>
        {item.tags?.split(',').slice(0, 3).map(tag => (
          <Text key={tag} style={styles.tagText}>#{tag}</Text>
        ))}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <FlatList
        data={logs}
        renderItem={renderInsight}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.largeTitle}>오늘의 성장</Text>
            <View style={styles.subHeader}>
              <Text style={styles.dateLabel}>{today.replace(/-/g, ' / ')}</Text>
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>{streak}일째 기록 중</Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{stats.rate}%</Text>
                <Text style={styles.statLabel}>오늘 달성률</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{stats.completed}/{stats.total}</Text>
                <Text style={styles.statLabel}>완료한 목표</Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>오늘의 루틴</Text>
              <TouchableOpacity onPress={() => navigation.navigate('GoalManage')}>
                <Text style={styles.manageText}>관리</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.goalList}>
              {dailyGoals.map(item => (
                <TouchableOpacity 
                  key={item.goal_id} 
                  style={styles.goalItem}
                  onPress={() => handleToggleGoal(item.goal_id, item.is_done)}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={item.is_done === 1 ? "checkmark-circle" : "ellipse-outline"} 
                    size={28} 
                    color={item.is_done === 1 ? DESIGN.colors.primary : DESIGN.colors.border} 
                  />
                  <View style={styles.goalTextWrapper}>
                    <Text style={styles.goalCategory}>{item.category}</Text>
                    <Text style={[styles.goalTitle, item.is_done === 1 && styles.goalTitleDone]}>
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              {dailyGoals.length === 0 && (
                <TouchableOpacity 
                  style={styles.emptyGoalBox}
                  onPress={() => navigation.navigate('GoalManage')}
                >
                  <Text style={styles.emptyGoalText}>목표를 설정하고 루틴을 만들어보세요.</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.sectionTitle}>지난 기록</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>아직 기록이 없습니다.</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={[styles.floatingButton, { bottom: insets.bottom + 20 }]}
        onPress={() => navigation.navigate('Write')}
      >
        <Text style={styles.buttonText}>회고 작성하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN.colors.bg,
  },
  list: {
    paddingHorizontal: DESIGN.spacing.padding,
  },
  header: {
    paddingTop: 20,
    marginBottom: 40,
  },
  largeTitle: {
    ...DESIGN.typography.largeTitle,
    color: DESIGN.colors.text,
    marginBottom: 8,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  dateLabel: {
    fontSize: 15,
    color: DESIGN.colors.textDim,
    fontWeight: '500',
  },
  streakBadge: {
    backgroundColor: DESIGN.colors.bgSecondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
    color: DESIGN.colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: DESIGN.colors.bgSecondary,
    borderRadius: DESIGN.spacing.radius,
    padding: 24,
    marginBottom: 40,
  },
  statBox: {
    flex: 1,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: DESIGN.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: DESIGN.colors.textDim,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...DESIGN.typography.title,
    color: DESIGN.colors.text,
  },
  manageText: {
    fontSize: 15,
    color: DESIGN.colors.primary,
    fontWeight: '500',
  },
  goalList: {
    marginBottom: 48,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: DESIGN.colors.border,
  },
  goalTextWrapper: {
    marginLeft: 16,
  },
  goalCategory: {
    fontSize: 11,
    fontWeight: '600',
    color: DESIGN.colors.primary,
    marginBottom: 2,
  },
  goalTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: DESIGN.colors.text,
  },
  goalTitleDone: {
    color: DESIGN.colors.textDim,
    textDecorationLine: 'line-through',
  },
  emptyGoalBox: {
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    borderStyle: 'dashed',
    borderRadius: DESIGN.spacing.radius,
  },
  emptyGoalText: {
    fontSize: 15,
    color: DESIGN.colors.textDim,
    textAlign: 'center',
  },
  insightItem: {
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: DESIGN.colors.border,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  insightDate: {
    fontSize: 13,
    color: DESIGN.colors.textDim,
    fontWeight: '500',
  },
  insightMood: {
    fontSize: 14,
  },
  insightTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: DESIGN.colors.text,
    marginBottom: 4,
  },
  insightSummary: {
    fontSize: 15,
    color: DESIGN.colors.primary,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
  },
  tagText: {
    fontSize: 13,
    color: DESIGN.colors.textDim,
    marginRight: 8,
  },
  emptyState: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: DESIGN.colors.textDim,
  },
  floatingButton: {
    position: 'absolute',
    left: DESIGN.spacing.padding,
    right: DESIGN.spacing.padding,
    height: 56,
    backgroundColor: DESIGN.colors.primary,
    borderRadius: DESIGN.spacing.radiusPill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
