import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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
import RetroCard from '../components/ui/RetroCard';
import RetroButton from '../components/ui/RetroButton';
import RetroInput from '../components/ui/RetroInput';
import PixelProgressBar from '../components/ui/PixelProgressBar';
import PixelSectionTitle from '../components/ui/PixelSectionTitle';

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
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 170 }]}
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
          <PixelSectionTitle>MISSION STATUS</PixelSectionTitle>
          <PixelProgressBar value={stats.rate} />
          <Text style={styles.percentText}>{stats.rate}%</Text>
          <Text style={styles.completeText}>{stats.completed} / {stats.total} COMPLETE</Text>
        </RetroCard>

        <RetroCard accent="cyan" style={styles.missionList}>
          <View style={styles.missionHeader}>
            <PixelSectionTitle>TODAY MISSION</PixelSectionTitle>
            <Text style={styles.completeText}>{stats.completed} / {stats.total}</Text>
          </View>

          {dailyGoals.map(renderRoutineGoal)}
          {todayOnlyGoals.map(renderTodayOnlyGoal)}

          {stats.total === 0 && (
            <View style={styles.emptyMission}>
              <Text style={styles.emptyTitle}>NO MISSION</Text>
              <Text style={styles.emptyText}>반복 목표를 만들거나 오늘만 할 목표를 추가하세요.</Text>
            </View>
          )}
        </RetroCard>

        <RetroCard accent="purple" style={styles.addPanel}>
          <PixelSectionTitle>ADD MISSION</PixelSectionTitle>
          <View style={styles.addMissionRow}>
            <RetroInput
              style={styles.todayOnlyInput}
              value={todayOnlyTitle}
              onChangeText={setTodayOnlyTitle}
              placeholder="오늘만 할 목표 추가"
              returnKeyType="done"
              onSubmitEditing={handleAddTodayOnlyGoal}
            />
            <TouchableOpacity style={styles.addMissionButton} onPress={handleAddTodayOnlyGoal}>
              <Text style={styles.addMissionText}>+</Text>
            </TouchableOpacity>
          </View>
        </RetroCard>
      </ScrollView>

      <View style={[styles.ctaWrap, { bottom: insets.bottom + 16 }]}>
        <RetroButton label="+ 오늘 기록하기" onPress={() => navigation.navigate('Write')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN.colors.bg,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 22,
  },
  arcadeTitle: {
    ...DESIGN.typography.largeTitle,
    color: DESIGN.colors.primary,
    fontSize: 34,
    letterSpacing: 2,
    textShadowColor: DESIGN.colors.cyan,
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 0,
  },
  subtitle: {
    fontFamily: DESIGN.fonts.pixelKo,
    color: DESIGN.colors.green,
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    marginBottom: 24,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statusChip: {
    flex: 1,
    height: 118,
    padding: 14,
    justifyContent: 'center',
  },
  statusLabel: {
    fontFamily: DESIGN.fonts.title,
    color: DESIGN.colors.cyan,
    fontWeight: '900',
    fontSize: 11,
    marginBottom: 8,
  },
  statusValue: {
    fontFamily: DESIGN.fonts.score,
    color: DESIGN.colors.yellow,
    fontWeight: '900',
    fontSize: 20,
  },
  missionStatus: {
    minHeight: 238,
    padding: 22,
    marginBottom: 28,
    justifyContent: 'center',
  },
  percentText: {
    fontFamily: DESIGN.fonts.score,
    color: DESIGN.colors.yellow,
    fontWeight: '900',
    fontSize: 42,
    textAlign: 'center',
    marginTop: 18,
  },
  completeText: {
    fontFamily: DESIGN.fonts.score,
    color: DESIGN.colors.cyan,
    fontWeight: '900',
    fontSize: 13,
    textAlign: 'center',
  },
  missionList: {
    padding: 16,
    marginBottom: 24,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  missionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 46,
    borderWidth: DESIGN.borders.pixel,
    borderColor: '#343B49',
    backgroundColor: '#090B10',
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
    borderColor: DESIGN.colors.green,
  },
  pixelCheckInner: {
    width: 12,
    height: 12,
    backgroundColor: DESIGN.colors.green,
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
    fontWeight: '700',
    lineHeight: 23,
  },
  missionMeta: {
    fontFamily: DESIGN.fonts.pixelKo,
    color: DESIGN.colors.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  todayOnlyTitle: {
    marginLeft: 12,
  },
  missionDone: {
    color: DESIGN.colors.green,
    textDecorationLine: 'line-through',
  },
  deleteText: {
    fontFamily: DESIGN.fonts.title,
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
    fontFamily: DESIGN.fonts.title,
    color: DESIGN.colors.yellow,
    fontWeight: '900',
    marginBottom: 6,
  },
  emptyText: {
    color: DESIGN.colors.textDim,
    textAlign: 'center',
    lineHeight: 22,
  },
  addPanel: {
    padding: 16,
  },
  addMissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todayOnlyInput: {
    flex: 1,
  },
  addMissionButton: {
    width: 48,
    height: 48,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DESIGN.colors.primary,
    borderWidth: DESIGN.borders.heavy,
    borderColor: DESIGN.colors.cyan,
    borderBottomColor: DESIGN.colors.yellow,
  },
  addMissionText: {
    fontFamily: DESIGN.fonts.title,
    color: DESIGN.colors.text,
    fontWeight: '900',
    fontSize: 22,
  },
  ctaWrap: {
    position: 'absolute',
    left: 24,
    right: 24,
  },
});
