import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAllLogs, getTodosByDate, addTodo, toggleTodo, deleteTodo, getCurrentStreak, getMonthlyStats, WorkLog, Todo } from '../database/db';
import { DESIGN } from '../theme/design';

const MOOD_MAP: any = {
  best: '🔥',
  good: '✨',
  normal: '☁️',
  hard: '🌊',
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [streak, setStreak] = useState(0);
  const [monthlyRate, setMonthlyRate] = useState(0);
  
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = today.substring(0, 7); // YYYY-MM

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = () => {
    setLogs(getAllLogs());
    setTodos(getTodosByDate(today));
    setStreak(getCurrentStreak());
    setMonthlyRate(getMonthlyStats(currentMonth).rate);
  };

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    addTodo(newTodo.trim(), today);
    setNewTodo('');
    setTodos(getTodosByDate(today));
  };

  const handleToggleTodo = (id: number, currentStatus: number) => {
    toggleTodo(id, currentStatus === 1 ? 0 : 1);
    setTodos(getTodosByDate(today));
    setMonthlyRate(getMonthlyStats(currentMonth).rate);
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodo(id);
    setTodos(getTodosByDate(today));
    setMonthlyRate(getMonthlyStats(currentMonth).rate);
  };

  const completedCount = todos.filter(t => t.is_completed === 1).length;
  const progress = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  const renderInsight = ({ item, index }: { item: WorkLog, index: number }) => (
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
      <Text style={styles.insightPreview} numberOfLines={1}>
        {item.content || '성장의 발자취를 남겨보세요.'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerGlow}>.</Text>
          <Text style={styles.headerLabel}>GROW DAY</Text>
        </View>
        <TouchableOpacity 
          style={styles.archiveButton}
          onPress={() => navigation.navigate('Calendar')}
        >
          <Ionicons name="layers-outline" size={20} color={DESIGN.colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={logs}
        renderItem={renderInsight}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.heroSection}>
            <View style={styles.heroHeader}>
              <Text style={styles.heroGreeting}>Hello, Dev.</Text>
              {streak > 0 && (
                <View style={styles.streakBadge}>
                  <Ionicons name="flame" size={16} color="#FF9500" />
                  <Text style={styles.streakText}>{streak}d</Text>
                </View>
              )}
            </View>
            
            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>COMPLETION</Text>
                <Text style={styles.statValue}>{monthlyRate}%</Text>
                <Text style={styles.statSub}>This Month</Text>
              </View>
              <View style={[styles.statCard, { marginLeft: 12 }]}>
                <Text style={styles.statLabel}>STREAK</Text>
                <Text style={styles.statValue}>{streak}</Text>
                <Text style={styles.statSub}>Active Days</Text>
              </View>
            </View>

            {/* Progress Card */}
            <View style={styles.progressCard}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Today's Engine</Text>
                <Text style={styles.progressValue}>{progress}%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressStat}>{completedCount} of {todos.length} goals achieved</Text>
            </View>

            {/* Todo Section */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>TODAY'S MISSION</Text>
              <Text style={styles.dateLabel}>{today.replace(/-/g, '. ')}</Text>
            </View>
            
            <View style={styles.todoContainer}>
              {todos.map(todo => (
                <View key={todo.id} style={styles.todoRow}>
                  <TouchableOpacity 
                    style={styles.todoCheck}
                    onPress={() => handleToggleTodo(todo.id!, todo.is_completed)}
                  >
                    <Ionicons 
                      name={todo.is_completed === 1 ? "checkmark-circle" : "ellipse-outline"} 
                      size={26} 
                      color={todo.is_completed === 1 ? DESIGN.colors.secondary : DESIGN.colors.textMuted} 
                    />
                  </TouchableOpacity>
                  <Text style={[styles.todoText, todo.is_completed === 1 && styles.todoTextCompleted]}>
                    {todo.task}
                  </Text>
                  <TouchableOpacity onPress={() => handleDeleteTodo(todo.id!)}>
                    <Ionicons name="close" size={20} color={DESIGN.colors.textMuted} />
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles.addTodoRow}>
                <TextInput
                  style={styles.addTodoInput}
                  value={newTodo}
                  onChangeText={setNewTodo}
                  placeholder="Identify a new goal..."
                  placeholderTextColor={DESIGN.colors.textMuted}
                  onSubmitEditing={handleAddTodo}
                />
                <TouchableOpacity onPress={handleAddTodo}>
                  <Ionicons name="add-circle" size={32} color={DESIGN.colors.primary} />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 48 }]}>GROWTH ARCHIVE</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Empty void. Start recording.</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('Write')}
        activeOpacity={0.8}
      >
        <Text style={styles.actionText}>PUBLISH INSIGHT</Text>
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
  archiveButton: {
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
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  heroGreeting: {
    fontSize: 48,
    fontWeight: '900',
    color: DESIGN.colors.text,
    letterSpacing: -2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.2)',
  },
  streakText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF9500',
    marginLeft: 4,
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
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: DESIGN.colors.text,
  },
  statSub: {
    fontSize: 10,
    color: DESIGN.colors.textDim,
    marginTop: 2,
    fontWeight: '500',
  },
  progressCard: {
    backgroundColor: DESIGN.colors.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    marginBottom: 40,
    shadowColor: DESIGN.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
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
    color: DESIGN.colors.secondary,
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
    color: DESIGN.colors.textDim,
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
  dateLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: DESIGN.colors.textMuted,
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
  addTodoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  addTodoInput: {
    flex: 1,
    fontSize: 16,
    color: DESIGN.colors.text,
    paddingRight: 10,
    fontWeight: '500',
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
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  insightPreview: {
    fontSize: 13,
    color: DESIGN.colors.textDim,
    lineHeight: 20,
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
    backgroundColor: DESIGN.colors.text, // Black accent in dark mode
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
