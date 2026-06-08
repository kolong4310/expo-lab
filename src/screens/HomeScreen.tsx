import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, TextInput, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
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
import RetroCard from '../components/RetroCard';
import RetroButton from '../components/RetroButton';

const PixelCheck = ({ checked }: { checked: boolean }) => (
  <View style={[styles.pixelCheck, checked && styles.pixelCheckDone]}>
    {checked && <View style={styles.pixelCheckInner} />}
  </View>
);

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [dailyGoals, setDailyGoals] = useState<any[]>([]);
  const [todayOnlyGoals, setTodayOnlyGoals] = useState<TodayOnlyGoal[]>([]);
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState({ total: 0, completed: 0, rate: 0 });
  const [todayLog, setTodayLog] = useState<WorkLog | null>(null);
  const [todayOnlyTitle, setTodayOnlyTitle] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const missionBlocks = Array.from({ length: 10 }, (_, index) => index < Math.round(stats.rate / 10));

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = () => {
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

  const renderRoutineGoal = (item: any) => (
    <TouchableOpacity
      key={item.goal_id}
      style={styles.missionRow}
      onPress={() => handleToggleGoal(item.goal_id, item.is_done)}
      activeOpacity={0.75}
    >
      <PixelCheck checked={item.is_done === 1} />
      <View style={styles.missionTextWrap}>
        <Text style={[styles.missionTitle, item.is_done === 1 && styles.missionDone]}>{item.title}</Text>
        <Text style={styles.missionMeta}>{item.category}{item.streak > 1 ? ` / ${item.streak}일 연속` : ''}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTodayOnlyGoal = (item: TodayOnlyGoal) => (
    <View key={item.id} style={styles.missionRow}>
      <TouchableOpacity
        style={styles.todayOnlyTapArea}
        onPress={() => handleToggleTodayOnlyGoal(item)}
        activeOpacity={0.75}
      >
        <PixelCheck checked={item.is_done === 1} />
        <Text style={[styles.missionTitle, styles.todayOnlyTitle, item.is_done === 1 && styles.missionDone]}>
          {item.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteTodayOnlyGoal(item.id!)} hitSlop={10}>
        <Text style={styles.deleteText}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.arcadeTitle}>GROWTH QUEST</Text>
        <Text style={styles.subtitle}>성장 로그 RPG</Text>

        <View style={styles.statusRow}>
          <RetroCard accent="pink" style={styles.statusChip}>
            <Text style={styles.statusLabel}>STREAK</Text>
            <Text style={styles.statusValue}>{streak} DAY</Text>
          </RetroCard>
          <RetroCard accent="green" style={styles.statusChip}>
            <Text style={styles.statusLabel}>STATE</Text>
            <Text style={styles.statusValue}>{todayLog ? 'LOGGED' : 'READY'}</Text>
          </RetroCard>
        </View>

        <RetroCard accent="pink" style={styles.missionStatus}>
          <Text style={styles.cardTitle}>MISSION STATUS</Text>
          <View style={styles.rpgBar}>
            {missionBlocks.map((filled, index) => (
              <View key={index} style={[styles.rpgBlock, filled && styles.rpgBlockFilled]} />
            ))}
          </View>
          <Text style={styles.percentText}>{stats.rate}%</Text>
          <Text style={styles.completeText}>{stats.completed} / {stats.total} COMPLETE</Text>
        </RetroCard>

        <RetroCard accent="cyan" style={styles.missionList}>
          <View style={styles.missionHeader}>
            <Text style={styles.cardTitle}>TODAY MISSION</Text>
            <Text style={styles.completeText}>{stats.completed} / {stats.total}</Text>
          </View>

          {dailyGoals.map(renderRoutineGoal)}
          {todayOnlyGoals.map(renderTodayOnlyGoal)}

          {stats.total === 0 && (
            <View style={styles.emptyMission}>
              <Text style={styles.emptyTitle}>NO MISSION</Text>
              <Text style={styles.emptyText}>SYSTEM 탭에서 반복 목표를 만들거나 오늘만 목표를 추가하세요.</Text>
            </View>
          )}

          <View style={styles.addMissionRow}>
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
            <TouchableOpacity style={styles.addMissionButton} onPress={handleAddTodayOnlyGoal}>
              <Text style={styles.addMissionText}>+</Text>
            </TouchableOpacity>
          </View>
        </RetroCard>
      </ScrollView>

      <RetroButton
        label="+ 오늘 기록하기"
        style={[styles.floatingButton, { bottom: insets.bottom + 20 }]}
        onPress={() => navigation.navigate('Write')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN.colors.bg,
  },
  content: {
    paddingHorizontal: DESIGN.spacing.padding,
    paddingTop: 22,
  },
  arcadeTitle: {
    ...DESIGN.typography.largeTitle,
    color: DESIGN.colors.primary,
    textShadowColor: DESIGN.colors.primaryLight,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  subtitle: {
    fontFamily: 'monospace',
    color: DESIGN.colors.mint,
    fontWeight: '900',
    fontSize: 16,
    marginTop: 6,
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  statusChip: {
    flex: 1,
    padding: 14,
  },
  statusLabel: {
    fontFamily: 'monospace',
    color: DESIGN.colors.primaryLight,
    fontWeight: '900',
    fontSize: 11,
    marginBottom: 6,
  },
  statusValue: {
    fontFamily: 'monospace',
    color: DESIGN.colors.yellow,
    fontWeight: '900',
    fontSize: 18,
  },
  missionStatus: {
    padding: 22,
    marginBottom: 18,
  },
  cardTitle: {
    fontFamily: 'monospace',
    color: DESIGN.colors.yellow,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
    marginBottom: 12,
  },
  rpgBar: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  rpgBlock: {
    flex: 1,
    height: 18,
    backgroundColor: DESIGN.colors.bg,
    borderWidth: 2,
    borderColor: '#252A35',
    marginRight: 5,
  },
  rpgBlockFilled: {
    backgroundColor: DESIGN.colors.primary,
    borderColor: DESIGN.colors.yellow,
  },
  percentText: {
    fontFamily: 'monospace',
    color: DESIGN.colors.yellow,
    fontWeight: '900',
    fontSize: 34,
    textAlign: 'center',
  },
  completeText: {
    fontFamily: 'monospace',
    color: DESIGN.colors.primaryLight,
    fontWeight: '900',
    fontSize: 13,
    textAlign: 'center',
  },
  missionList: {
    padding: 16,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  missionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    borderWidth: DESIGN.borders.pixel,
    borderColor: '#343B49',
    backgroundColor: DESIGN.colors.bgSecondary,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  pixelCheck: {
    width: 24,
    height: 24,
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.textDim,
    backgroundColor: DESIGN.colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pixelCheckDone: {
    borderColor: DESIGN.colors.mint,
  },
  pixelCheckInner: {
    width: 12,
    height: 12,
    backgroundColor: DESIGN.colors.mint,
  },
  missionTextWrap: {
    flex: 1,
    marginLeft: 12,
  },
  todayOnlyTapArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  missionTitle: {
    color: DESIGN.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  missionMeta: {
    fontFamily: 'monospace',
    color: DESIGN.colors.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  todayOnlyTitle: {
    marginLeft: 12,
  },
  missionDone: {
    color: DESIGN.colors.mint,
    textDecorationLine: 'line-through',
  },
  deleteText: {
    fontFamily: 'monospace',
    color: DESIGN.colors.error,
    fontWeight: '900',
    fontSize: 16,
    paddingLeft: 10,
  },
  emptyMission: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyTitle: {
    fontFamily: 'monospace',
    color: DESIGN.colors.yellow,
    fontWeight: '900',
    marginBottom: 6,
  },
  emptyText: {
    color: DESIGN.colors.textDim,
    textAlign: 'center',
    lineHeight: 21,
  },
  addMissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  todayOnlyInput: {
    flex: 1,
    minHeight: 46,
    color: DESIGN.colors.text,
    backgroundColor: DESIGN.colors.bg,
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.primaryLight,
    paddingHorizontal: 12,
  },
  addMissionButton: {
    width: 46,
    height: 46,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN.colors.primary,
    borderWidth: DESIGN.borders.heavy,
    borderColor: DESIGN.colors.primaryLight,
    borderBottomColor: DESIGN.colors.yellow,
  },
  addMissionText: {
    fontFamily: 'monospace',
    color: DESIGN.colors.text,
    fontWeight: '900',
    fontSize: 22,
  },
  floatingButton: {
    position: 'absolute',
    left: DESIGN.spacing.padding,
    right: DESIGN.spacing.padding,
  },
});
