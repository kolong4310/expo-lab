import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, TextInput, Animated } from 'react-native';
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
      activeOpacity={0.4}
    >
      <View style={styles.insightMeta}>
        <Text style={styles.insightDate}>{item.date.split('-').slice(1).join(' / ')}</Text>
        <View style={styles.insightDivider} />
        {item.mood && <Text style={styles.insightMood}>{MOOD_MAP[item.mood]}</Text>}
      </View>
      <Text style={styles.insightTitle} numberOfLines={1}>{item.title}</Text>
      
      {item.daily_summary && (
        <Text style={styles.insightSummary} numberOfLines={1}>"{item.daily_summary}"</Text>
      )}

      <Text style={styles.insightPreview} numberOfLines={1}>
        {item.content || item.learned || '성장의 발자취를 남겨보세요.'}
      </Text>

      {item.tags && (
        <View style={styles.insightTagList}>
          {item.tags.split(',').slice(0, 3).map(tag => (
            <Text key={tag} style={styles.insightTagText}>#{tag}</Text>
          ))}
          {item.tags.split(',').length > 3 && <Text style={styles.insightTagText}>...</Text>}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerGlow}>.</Text>
          <Text style={styles.headerLabel}>GROW DAY</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => navigation.navigate('Search')}
          >
            <Ionicons name="search-outline" size={20} color={DESIGN.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={logs}
        renderItem={renderInsight}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 140 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.heroSection}>
            <View style={styles.identityContainer}>
              <View style={styles.identityHeader}>
                <View style={styles.statusDot} />
                <Text style={styles.identityLabel}>GROWTH PROTOCOL ACTIVE</Text>
              </View>
              <View style={styles.identityMain}>
                <Text style={styles.logCountText}>{logs.length.toString().padStart(2, '0')}</Text>
                <View style={styles.identityInfo}>
                  <Text style={styles.identityInfoTitle}>TOTAL</Text>
                  <Text style={styles.identityInfoTitle}>INSIGHTS</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>STREAK</Text>
                <View style={styles.statValueRow}>
                  <Text style={styles.statValue}>{streak}</Text>
                  <Text style={styles.statUnit}>DAYS</Text>
                </View>
              </View>
              <View style={[styles.statCard, { marginLeft: 12, borderColor: DESIGN.colors.secondary }]}>
                <Text style={[styles.statLabel, { color: DESIGN.colors.secondary }]}>COMPLETION</Text>
                <View style={styles.statValueRow}>
                  <Text style={styles.statValue}>{stats.rate}</Text>
                  <Text style={styles.statUnit}>%</Text>
                </View>
              </View>
            </View>

            <View style={styles.progressCard}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Daily Engine Status</Text>
                <Text style={styles.progressValue}>{stats.rate}%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${stats.rate}%` }]} />
              </View>
              <Text style={styles.progressStat}>{stats.completed} of {stats.total} missions initialized</Text>
            </View>

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>GROWTH ROUTINES</Text>
              <TouchableOpacity onPress={() => navigation.navigate('GoalManage')}>
                <Text style={styles.manageLink}>MANAGE</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.todoContainer}>
              {dailyGoals.map(item => (
                <View key={item.goal_id} style={styles.todoRow}>
                  <TouchableOpacity 
                    style={styles.todoCheck}
                    onPress={() => handleToggleGoal(item.goal_id, item.is_done)}
                  >
                    <Ionicons 
                      name={item.is_done === 1 ? "checkmark-circle" : "ellipse-outline"} 
                      size={26} 
                      color={item.is_done === 1 ? DESIGN.colors.secondary : DESIGN.colors.textMuted} 
                    />
                  </TouchableOpacity>
                  <View style={styles.todoTextContainer}>
                    <Text style={styles.routineCategory}>{item.category}</Text>
                    <Text style={[styles.todoText, item.is_done === 1 && styles.todoTextCompleted]}>
                      {item.title}
                    </Text>
                  </View>
                </View>
              ))}
              {dailyGoals.length === 0 && (
                <TouchableOpacity 
                  style={styles.emptyTodoRow}
                  onPress={() => navigation.navigate('GoalManage')}
                >
                  <Text style={styles.emptyTodoText}>루틴을 등록하고 성장을 시작하세요.</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 48 }]}>SYSTEM LOG ARCHIVE</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Terminal ready. Awaiting input.</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={[styles.actionButton, { bottom: (insets.bottom > 0 ? insets.bottom : 0) + 90 }]}
        onPress={() => navigation.navigate('Write')}
        activeOpacity={0.8}
      >
        <Text style={styles.actionText}>EXECUTE INSIGHT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN.colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerGlow: {
    fontSize: 24,
    color: DESIGN.colors.secondary,
    fontWeight: '900',
    marginRight: 6,
    marginTop: -10,
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: DESIGN.colors.text,
    letterSpacing: 3,
  },
  headerRight: {
    flexDirection: 'row',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    paddingHorizontal: 28,
    paddingTop: 10,
    paddingBottom: 20,
  },
  identityContainer: {
    marginBottom: 40,
  },
  identityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: DESIGN.colors.secondary,
    marginRight: 8,
  },
  identityLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: DESIGN.colors.secondary,
    letterSpacing: 1.5,
  },
  identityMain: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  logCountText: {
    fontSize: 80,
    fontWeight: '900',
    color: DESIGN.colors.text,
    lineHeight: 85,
    letterSpacing: -4,
  },
  identityInfo: {
    marginLeft: 12,
    marginBottom: 12,
  },
  identityInfoTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: DESIGN.colors.textDim,
    lineHeight: 16,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: DESIGN.colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: DESIGN.colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
    color: DESIGN.colors.text,
  },
  statUnit: {
    fontSize: 10,
    fontWeight: '900',
    color: DESIGN.colors.textMuted,
    marginLeft: 4,
    letterSpacing: 1,
  },
  progressCard: {
    backgroundColor: DESIGN.colors.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    marginBottom: 40,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: DESIGN.colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  progressValue: {
    fontSize: 36,
    fontWeight: '900',
    color: DESIGN.colors.text,
    letterSpacing: -1,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: DESIGN.colors.bg,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: DESIGN.colors.secondary,
  },
  progressStat: {
    fontSize: 11,
    color: DESIGN.colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: DESIGN.colors.textMuted,
    letterSpacing: 2,
  },
  manageLink: {
    fontSize: 10,
    fontWeight: '900',
    color: DESIGN.colors.primary,
    letterSpacing: 1,
  },
  todoContainer: {
    backgroundColor: DESIGN.colors.surface,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.colors.border,
  },
  todoCheck: {
    marginRight: 14,
  },
  todoTextContainer: {
    flex: 1,
  },
  routineCategory: {
    fontSize: 9,
    fontWeight: '900',
    color: DESIGN.colors.secondary,
    letterSpacing: 1,
    marginBottom: 2,
  },
  todoText: {
    flex: 1,
    fontSize: 16,
    color: DESIGN.colors.text,
    fontWeight: '500',
  },
  todoTextCompleted: {
    color: DESIGN.colors.textMuted,
    textDecorationLine: 'line-through',
  },
  emptyTodoRow: {
    padding: 20,
    alignItems: 'center',
  },
  emptyTodoText: {
    color: DESIGN.colors.textDim,
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 150,
  },
  insightItem: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.colors.border,
    marginHorizontal: 28,
  },
  insightMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightDate: {
    fontSize: 10,
    fontWeight: '800',
    color: DESIGN.colors.textDim,
    letterSpacing: 1,
  },
  insightDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: DESIGN.colors.border,
    marginHorizontal: 8,
  },
  insightMood: {
    fontSize: 11,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DESIGN.colors.text,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  insightSummary: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN.colors.accent,
    fontStyle: 'italic',
    marginBottom: 6,
    opacity: 0.9,
  },
  insightPreview: {
    fontSize: 13,
    color: DESIGN.colors.textDim,
    lineHeight: 20,
    marginBottom: 8,
  },
  insightTagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  insightTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: DESIGN.colors.primary,
    marginRight: 8,
  },
  emptyState: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: DESIGN.colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  actionButton: {
    position: 'absolute',
    right: 28,
    bottom: 40,
    height: 60,
    paddingHorizontal: 28,
    borderRadius: 20,
    backgroundColor: DESIGN.colors.text, 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '900',
    color: DESIGN.colors.bg,
    letterSpacing: 2.5,
  },
});
