import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, TextInput, Pressable } from 'react-native';
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
import { retroStyles } from '../theme/retro';

const MOOD_MAP: Record<string, string> = {
  best: 'BEST',
  good: 'GOOD',
  normal: 'NORM',
  hard: 'HARD',
};

const PixelCheck = ({ checked }: { checked: boolean }) => (
  <View style={[styles.pixelCheck, checked && styles.pixelCheckDone]}>
    {checked && <View style={styles.pixelCheckInner} />}
  </View>
);

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
  const progressBlocks = Array.from({ length: 10 }, (_, index) => index < Math.round(stats.rate / 10));

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
      activeOpacity={0.7}
    >
      <View style={styles.pixelCorner} />
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
      activeOpacity={0.75}
    >
      <PixelCheck checked={item.is_done === 1} />
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
        activeOpacity={0.75}
      >
        <PixelCheck checked={item.is_done === 1} />
        <Text style={[styles.goalTitle, styles.todayOnlyTitle, item.is_done === 1 && styles.goalTitleDone]}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteTodayOnlyGoal(item.id!)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="close" size={22} color={DESIGN.colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />

      <FlatList
        style={styles.container}
        data={logs}
        renderItem={renderInsight}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.arcadeTitle}>TODAY QUEST</Text>
            <View style={styles.subHeader}>
              <Text style={styles.dateLabel}>{today.replace(/-/g, ' / ')}</Text>
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>{streak} DAY RUN</Text>
              </View>
            </View>

            <View style={styles.mantraSection}>
              <Text style={styles.sectionLabel}>TODAY LINE</Text>
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
                  <Pressable
                    style={({ pressed }) => [styles.pixelButton, pressed && styles.pixelButtonPressed]}
                    onPress={() => navigation.navigate('Write')}
                  >
                    <Text style={styles.pixelButtonText}>기록 작성하기</Text>
                  </Pressable>
                </View>
              )}
            </View>

            <View style={styles.scoreBoard}>
              <View style={styles.pixelCorner} />
              <View style={styles.statBox}>
                <Text style={styles.scoreLabel}>CLEAR RATE</Text>
                <Text style={styles.statValue}>{stats.rate}%</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.scoreLabel}>MISSION</Text>
                <Text style={styles.statValue}>{stats.completed} / {stats.total}</Text>
              </View>
              <View style={styles.blockProgress}>
                {progressBlocks.map((filled, index) => (
                  <View key={index} style={[styles.progressBlock, filled && styles.progressBlockFilled]} />
                ))}
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
                <Pressable
                  style={({ pressed }) => [styles.addGoalButton, pressed && styles.pixelButtonPressed]}
                  onPress={handleAddTodayOnlyGoal}
                >
                  <Text style={styles.addGoalButtonText}>+</Text>
                </Pressable>
              </View>
              {todayOnlyGoals.map(renderTodayOnlyGoal)}
            </View>

            {!hasTodayGoals && (
              <View style={styles.emptyGoalBox}>
                <Text style={styles.emptyGoalTitle}>아직 오늘의 목표가 없습니다.</Text>
                <Text style={styles.emptyGoalText}>반복 목표를 추가하거나 오늘만 할 목표를 입력해보세요.</Text>
              </View>
            )}

            <View style={styles.pixelDivider} />
            <Text style={styles.sectionTitle}>지난 기록</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>아직 기록이 없습니다.</Text>
          </View>
        }
      />

      <Pressable
        style={({ pressed }) => [
          styles.floatingButton,
          { bottom: insets.bottom + 20 },
          pressed && styles.pixelButtonPressed,
        ]}
        onPress={() => navigation.navigate('Write')}
      >
        <Text style={styles.buttonText}>기록하기</Text>
      </Pressable>
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
  arcadeTitle: {
    ...DESIGN.typography.largeTitle,
    color: DESIGN.colors.yellow,
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: DESIGN.colors.primary,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
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
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  streakBadge: {
    backgroundColor: DESIGN.colors.surface,
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.mint,
    borderRightWidth: DESIGN.borders.heavy,
    borderBottomWidth: DESIGN.borders.heavy,
    borderRightColor: DESIGN.colors.primary,
    borderBottomColor: DESIGN.colors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '900',
    color: DESIGN.colors.mint,
    fontFamily: 'monospace',
  },
  mantraSection: {
    ...retroStyles.card,
    padding: 18,
    marginBottom: 30,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: DESIGN.colors.primaryLight,
    fontFamily: 'monospace',
    letterSpacing: 1,
    marginBottom: 16,
  },
  mantraText: {
    fontSize: 23,
    fontWeight: '900',
    color: DESIGN.colors.text,
    lineHeight: 32,
  },
  mantraPlaceholder: {
    fontSize: 18,
    fontWeight: '700',
    color: DESIGN.colors.text,
    lineHeight: 28,
    marginBottom: 18,
  },
  pixelButton: {
    ...retroStyles.button,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  pixelButtonPressed: {
    transform: [{ translateX: 3 }, { translateY: 3 }],
    borderRightWidth: DESIGN.borders.pixel,
    borderBottomWidth: DESIGN.borders.pixel,
  },
  pixelButtonText: {
    ...retroStyles.pixelText,
    fontSize: 15,
    color: DESIGN.colors.text,
  },
  scoreBoard: {
    ...retroStyles.cardPink,
    padding: 22,
    marginBottom: 34,
  },
  pixelCorner: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 8,
    height: 8,
    backgroundColor: DESIGN.colors.yellow,
  },
  statBox: {
    marginBottom: 12,
  },
  scoreLabel: {
    ...retroStyles.pixelText,
    fontSize: 12,
    color: DESIGN.colors.primaryLight,
    marginBottom: 4,
  },
  statValue: {
    ...retroStyles.pixelText,
    fontSize: 34,
    color: DESIGN.colors.yellow,
  },
  blockProgress: {
    flexDirection: 'row',
    marginTop: 8,
  },
  progressBlock: {
    flex: 1,
    height: 14,
    backgroundColor: DESIGN.colors.bg,
    borderWidth: 2,
    borderColor: DESIGN.colors.border,
    marginRight: 4,
  },
  progressBlockFilled: {
    backgroundColor: DESIGN.colors.mint,
    borderColor: DESIGN.colors.yellow,
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
    ...retroStyles.pixelText,
    fontSize: 13,
    color: DESIGN.colors.primary,
  },
  goalSection: {
    marginBottom: 28,
  },
  goalGroupTitle: {
    ...retroStyles.pixelText,
    fontSize: 17,
    color: DESIGN.colors.yellow,
    marginBottom: 4,
  },
  goalGroupDescription: {
    fontSize: 14,
    color: DESIGN.colors.textDim,
    marginBottom: 12,
  },
  goalItem: {
    ...retroStyles.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  pixelCheck: {
    width: 26,
    height: 26,
    backgroundColor: DESIGN.colors.bg,
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pixelCheckDone: {
    borderColor: DESIGN.colors.mint,
  },
  pixelCheckInner: {
    width: 12,
    height: 12,
    backgroundColor: DESIGN.colors.mint,
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
    ...retroStyles.pixelText,
    fontSize: 11,
    color: DESIGN.colors.yellow,
    marginBottom: 2,
  },
  goalTitle: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: '700',
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
    ...retroStyles.pixelText,
    fontSize: 12,
    color: DESIGN.colors.primary,
    marginTop: 4,
  },
  todayOnlyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  todayOnlyInput: {
    ...retroStyles.input,
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 14,
    fontSize: 16,
    color: DESIGN.colors.text,
  },
  addGoalButton: {
    ...retroStyles.button,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  addGoalButtonText: {
    ...retroStyles.pixelText,
    fontSize: 24,
    color: DESIGN.colors.text,
  },
  deleteButton: {
    paddingLeft: 12,
  },
  emptyGoalBox: {
    ...retroStyles.card,
    padding: 24,
    alignItems: 'center',
    marginBottom: 40,
  },
  emptyGoalTitle: {
    ...retroStyles.pixelText,
    fontSize: 16,
    color: DESIGN.colors.text,
    marginBottom: 6,
  },
  emptyGoalText: {
    fontSize: 15,
    color: DESIGN.colors.textDim,
    textAlign: 'center',
    lineHeight: 22,
  },
  pixelDivider: {
    ...retroStyles.dotLine,
    marginTop: 8,
    marginBottom: 22,
  },
  insightItem: {
    ...retroStyles.card,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  insightDate: {
    ...retroStyles.pixelText,
    fontSize: 13,
    color: DESIGN.colors.textDim,
  },
  insightMood: {
    ...retroStyles.pixelText,
    fontSize: 12,
    color: DESIGN.colors.mint,
  },
  insightTitle: {
    ...retroStyles.pixelText,
    fontSize: 18,
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
    flexWrap: 'wrap',
  },
  tagText: {
    ...retroStyles.pixelText,
    fontSize: 12,
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
    ...retroStyles.button,
    position: 'absolute',
    left: DESIGN.spacing.padding,
    right: DESIGN.spacing.padding,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    ...retroStyles.pixelText,
    fontSize: 17,
    color: DESIGN.colors.text,
  },
});
