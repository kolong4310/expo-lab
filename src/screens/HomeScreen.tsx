import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  getAllLogs,
  getLogsByDate,
  getDailyGoalsWithStats,
  getTodayOnlyGoals,
  addTodayOnlyGoal,
  toggleTodayOnlyGoal,
  deleteTodayOnlyGoal,
  toggleGoalCheck,
  getGrowthStats,
  getCurrentStreak,
  WorkLog,
  TodayOnlyGoal,
} from '../database/db';
import { DESIGN } from '../theme/design';

const MOOD_MAP: Record<string, string> = {
  best: '🔥',
  good: '🙂',
  normal: '😐',
  hard: '😮‍💨',
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [dailyGoals, setDailyGoals] = useState<any[]>([]);
  const [todayOnlyGoals, setTodayOnlyGoals] = useState<TodayOnlyGoal[]>([]);
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState({ total: 0, completed: 0, rate: 0 });
  const [todayLog, setTodayLog] = useState<WorkLog | null>(null);
  const [todayOnlyTitle, setTodayOnlyTitle] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const hasTodayGoals = dailyGoals.length > 0 || todayOnlyGoals.length > 0;

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = () => {
    setLogs(getAllLogs());
    setDailyGoals(getDailyGoalsWithStats(today));
    setTodayOnlyGoals(getTodayOnlyGoals(today));
    setStreak(getCurrentStreak());
    setStats(getGrowthStats(today));

    const todayLogs = getLogsByDate(today);
    setTodayLog(todayLogs.length > 0 ? todayLogs[0] : null);
  };

  const handleToggleGoal = (goalId: number, currentDone: number) => {
    toggleGoalCheck(goalId, today, currentDone === 1 ? 0 : 1);
    loadData();
  };

  const handleAddTodayOnlyGoal = () => {
    const title = todayOnlyTitle.trim();
    if (!title) return;

    addTodayOnlyGoal(title, today);
    setTodayOnlyTitle('');
    loadData();
  };

  const handleToggleTodayOnlyGoal = (item: TodayOnlyGoal) => {
    toggleTodayOnlyGoal(item.id!, item.is_done === 1 ? 0 : 1);
    loadData();
  };

  const handleDeleteTodayOnlyGoal = (id: number) => {
    deleteTodayOnlyGoal(id);
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

  const renderRoutineGoal = (item: any) => (
    <TouchableOpacity
      key={item.goal_id}
      style={styles.goalItem}
      onPress={() => handleToggleGoal(item.goal_id, item.is_done)}
      activeOpacity={0.7}
    >
      <Ionicons
        name={item.is_done === 1 ? 'checkmark-circle' : 'ellipse-outline'}
        size={28}
        color={item.is_done === 1 ? DESIGN.colors.primary : DESIGN.colors.border}
      />
      <View style={styles.goalTextWrapper}>
        <Text style={styles.goalCategory}>{item.category}</Text>
        <Text style={[styles.goalTitle, item.is_done === 1 && styles.goalTitleDone]}>
          {item.title}
        </Text>
        {item.streak > 1 && (
          <Text style={styles.goalStreak}>{item.streak}일 연속</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderTodayOnlyGoal = (item: TodayOnlyGoal) => (
    <View key={item.id} style={styles.goalItem}>
      <TouchableOpacity
        style={styles.goalCheckArea}
        onPress={() => handleToggleTodayOnlyGoal(item)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={item.is_done === 1 ? 'checkmark-circle' : 'ellipse-outline'}
          size={28}
          color={item.is_done === 1 ? DESIGN.colors.primary : DESIGN.colors.border}
        />
        <Text style={[styles.goalTitle, styles.todayOnlyTitle, item.is_done === 1 && styles.goalTitleDone]}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTodayOnlyGoal(item.id!)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="trash-outline" size={20} color={DESIGN.colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={DESIGN.colors.bg} />

      <FlatList
        style={styles.container}
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
                <Text style={styles.streakText}>{streak}일 연속 기록 중</Text>
              </View>
            </View>

            <View style={styles.mantraSection}>
              <Text style={styles.sectionLabel}>오늘의 한 줄</Text>
              {todayLog ? (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Detail', { log: todayLog })}
                  activeOpacity={0.7}
                >
                  <Text style={styles.mantraText}>"{todayLog.daily_summary || todayLog.title}"</Text>
                </TouchableOpacity>
              ) : (
                <View>
                  <Text style={styles.mantraPlaceholder}>오늘의 성장을 한 문장으로 남겨보세요.</Text>
                  <TouchableOpacity
                    style={styles.mantraButton}
                    onPress={() => navigation.navigate('Write')}
                  >
                    <Text style={styles.mantraButtonText}>기록 작성하기</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{stats.rate}%</Text>
                <Text style={styles.statLabel}>오늘 목표 달성률</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{stats.completed} / {stats.total}</Text>
                <Text style={styles.statLabel}>완료</Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>오늘의 목표</Text>
              <TouchableOpacity onPress={() => navigation.navigate('GoalManage')}>
                <Text style={styles.manageText}>반복 목표 관리</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.goalSection}>
              <Text style={styles.goalGroupTitle}>매일 반복 목표</Text>
              <Text style={styles.goalGroupDescription}>매일 반복해서 체크하는 성장 루틴</Text>
              {dailyGoals.map(renderRoutineGoal)}
            </View>

            <View style={styles.goalSection}>
              <Text style={styles.goalGroupTitle}>오늘만 목표</Text>
              <Text style={styles.goalGroupDescription}>오늘만 처리하면 되는 임시 목표</Text>
              <View style={styles.todayOnlyInputRow}>
                <TextInput
                  style={styles.todayOnlyInput}
                  value={todayOnlyTitle}
                  onChangeText={setTodayOnlyTitle}
                  placeholder="오늘만 할 목표 추가"
                  placeholderTextColor={DESIGN.colors.textDim}
                  returnKeyType="done"
                  onSubmitEditing={handleAddTodayOnlyGoal}
                  selectionColor={DESIGN.colors.primary}
                />
                <TouchableOpacity style={styles.addGoalButton} onPress={handleAddTodayOnlyGoal}>
                  <Ionicons name="add" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              {todayOnlyGoals.map(renderTodayOnlyGoal)}
            </View>

            {!hasTodayGoals && (
              <View style={styles.emptyGoalBox}>
                <Text style={styles.emptyGoalTitle}>아직 오늘의 목표가 없습니다.</Text>
                <Text style={styles.emptyGoalText}>반복 목표를 추가하거나 오늘만 할 목표를 입력해보세요.</Text>
              </View>
            )}

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
        <Text style={styles.buttonText}>기록하기</Text>
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
  mantraSection: {
    marginBottom: 40,
    paddingVertical: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: DESIGN.colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  mantraText: {
    fontSize: 26,
    fontWeight: '600',
    color: DESIGN.colors.text,
    fontStyle: 'italic',
    lineHeight: 34,
  },
  mantraPlaceholder: {
    fontSize: 22,
    fontWeight: '500',
    color: DESIGN.colors.textDim,
    lineHeight: 30,
    marginBottom: 20,
  },
  mantraButton: {
    alignSelf: 'flex-start',
    backgroundColor: DESIGN.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  mantraButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: DESIGN.colors.bgSecondary,
    borderRadius: DESIGN.spacing.radius,
    padding: 24,
    marginBottom: 36,
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
    marginBottom: 20,
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
  goalSection: {
    marginBottom: 28,
  },
  goalGroupTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: DESIGN.colors.text,
    marginBottom: 4,
  },
  goalGroupDescription: {
    fontSize: 14,
    color: DESIGN.colors.textDim,
    marginBottom: 12,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: DESIGN.colors.border,
  },
  goalCheckArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalTextWrapper: {
    flex: 1,
    marginLeft: 16,
  },
  goalCategory: {
    fontSize: 11,
    fontWeight: '600',
    color: DESIGN.colors.primary,
    marginBottom: 2,
  },
  goalTitle: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: '500',
    color: DESIGN.colors.text,
  },
  todayOnlyTitle: {
    marginLeft: 16,
  },
  goalTitleDone: {
    color: DESIGN.colors.textDim,
    textDecorationLine: 'line-through',
  },
  goalStreak: {
    fontSize: 12,
    fontWeight: '600',
    color: DESIGN.colors.primary,
    marginTop: 4,
  },
  todayOnlyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  todayOnlyInput: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    backgroundColor: DESIGN.colors.bgSecondary,
    paddingHorizontal: 14,
    fontSize: 16,
    color: DESIGN.colors.text,
  },
  addGoalButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: DESIGN.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteButton: {
    paddingLeft: 12,
  },
  emptyGoalBox: {
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    borderStyle: 'dashed',
    borderRadius: DESIGN.spacing.radius,
    marginBottom: 40,
  },
  emptyGoalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DESIGN.colors.text,
    marginBottom: 6,
  },
  emptyGoalText: {
    fontSize: 15,
    color: DESIGN.colors.textDim,
    textAlign: 'center',
    lineHeight: 22,
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
