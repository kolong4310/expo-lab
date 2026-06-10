import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import PrimaryButton from "../components/PrimaryButton";
import StatCard from "../components/StatCard";
import TodoItem from "../components/TodoItem";
import PixelProgressBar from "../components/ui/PixelProgressBar";
import PixelSectionTitle from "../components/ui/PixelSectionTitle";
import RetroCard from "../components/ui/RetroCard";
import RetroInput from "../components/ui/RetroInput";
import { useLogs } from "../hooks/useLogs";
import { useStats } from "../hooks/useStats";
import { useTodos } from "../hooks/useTodos";
import { DESIGN } from "../theme/design";
import { formatLocalDate } from "../utils/date";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const today = formatLocalDate();
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const { todayLog, refreshLogs } = useLogs(today);
  const {
    dailyTodos,
    todayOnlyTodos,
    refreshTodos,
    addTodo,
    toggleDailyTodo,
    toggleTodayOnlyTodo,
    deleteTodo,
  } = useTodos(today);
  const { streak, stats, refreshStats } = useStats(today);

  const refreshHome = useCallback(() => {
    refreshLogs();
    refreshTodos();
    refreshStats();
  }, [refreshLogs, refreshStats, refreshTodos]);

  useFocusEffect(
    useCallback(() => {
      refreshHome();
    }, [refreshHome]),
  );

  const handleAddTodo = () => {
    const title = newTodoTitle.trim();
    if (!title) return;

    addTodo(title);
    setNewTodoTitle("");
    refreshStats();
  };

  const handleToggleDailyTodo = (todo: (typeof dailyTodos)[number]) => {
    toggleDailyTodo(todo);
    refreshStats();
  };

  const handleToggleTodayOnlyTodo = (todo: (typeof todayOnlyTodos)[number]) => {
    toggleTodayOnlyTodo(todo);
    refreshStats();
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodo(id);
    refreshStats();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 190 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader title="오늘 업무 로그" subtitle="오늘의 목표와 성장 기록" />

        <View style={styles.statusRow}>
          <StatCard label="연속 달성" value={`${streak}일`} accent="pink" />
          <StatCard
            label="오늘 기록"
            value={todayLog ? "작성 완료" : "작성 전"}
            accent="green"
          />
        </View>

        <RetroCard accent="pink" style={styles.progressCard}>
          <PixelSectionTitle>오늘 진행률</PixelSectionTitle>
          <PixelProgressBar value={stats.rate} />
          <Text style={styles.percentText}>{stats.rate}%</Text>
          <Text style={styles.completeText}>
            {stats.completed} / {stats.total}개 완료
          </Text>
        </RetroCard>

        <RetroCard accent="cyan" style={styles.todoList}>
          <View style={styles.sectionHeader}>
            <PixelSectionTitle>오늘 목표</PixelSectionTitle>
            <Text style={styles.completeText}>
              {stats.completed} / {stats.total}
            </Text>
          </View>

          {dailyTodos.map((todo) => (
            <TodoItem
              key={`daily-${todo.goal_id}`}
              title={todo.title}
              completed={todo.is_done === 1}
              meta={`${todo.category}${todo.streak > 1 ? ` · ${todo.streak}일 연속` : ""}`}
              onToggle={() => handleToggleDailyTodo(todo)}
            />
          ))}
          {todayOnlyTodos.map((todo) => (
            <TodoItem
              key={`once-${todo.id}`}
              title={todo.title}
              completed={todo.is_done === 1}
              meta="오늘만 할 목표"
              onToggle={() => handleToggleTodayOnlyTodo(todo)}
              onDelete={
                todo.id === undefined
                  ? undefined
                  : () => handleDeleteTodo(todo.id!)
              }
            />
          ))}

          {stats.total === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>오늘 목표가 없습니다</Text>
              <Text style={styles.emptyText}>
                오늘 집중할 일을 하나 추가해보세요.
              </Text>
            </View>
          )}
        </RetroCard>

        <RetroCard accent="purple" style={styles.addPanel}>
          <PixelSectionTitle>오늘 목표 추가</PixelSectionTitle>
          <View style={styles.addRow}>
            <RetroInput
              style={styles.todoInput}
              value={newTodoTitle}
              onChangeText={setNewTodoTitle}
              placeholder="오늘 완료할 목표"
              returnKeyType="done"
              onSubmitEditing={handleAddTodo}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </RetroCard>
      </ScrollView>

      <View style={[styles.ctaWrap, { bottom: insets.bottom + 16 }]}>
        <PrimaryButton
          label="오늘 기록하기"
          onPress={() => navigation.navigate("Write")}
        />
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
  statusRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  progressCard: {
    minHeight: 220,
    justifyContent: "center",
    marginBottom: 28,
    padding: 22,
  },
  percentText: {
    marginTop: 18,
    color: DESIGN.colors.yellow,
    fontFamily: DESIGN.fonts.score,
    fontSize: 42,
    fontWeight: "900",
    textAlign: "center",
  },
  completeText: {
    color: DESIGN.colors.cyan,
    fontFamily: DESIGN.fonts.score,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },
  todoList: {
    marginBottom: 24,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  empty: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyTitle: {
    marginBottom: 6,
    color: DESIGN.colors.yellow,
    fontFamily: DESIGN.fonts.pixelKo,
    fontWeight: "900",
  },
  emptyText: {
    color: DESIGN.colors.textDim,
    lineHeight: 22,
    textAlign: "center",
  },
  addPanel: {
    padding: 16,
  },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  todoInput: {
    flex: 1,
  },
  addButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    borderWidth: DESIGN.borders.heavy,
    borderColor: DESIGN.colors.cyan,
    borderBottomColor: DESIGN.colors.yellow,
    backgroundColor: DESIGN.colors.primary,
  },
  addButtonText: {
    color: DESIGN.colors.text,
    fontFamily: DESIGN.fonts.title,
    fontSize: 22,
    fontWeight: "900",
  },
  ctaWrap: {
    position: "absolute",
    right: 24,
    left: 24,
  },
});
