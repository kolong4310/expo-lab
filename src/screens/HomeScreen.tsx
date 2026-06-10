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
          { paddingBottom: insets.bottom + 125 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader
          title="오늘 업무 로그"
          subtitle={today.replace(/-/g, ".")}
          compact
          titleStyle={styles.headerTitle}
        />

        <View style={styles.statusRow}>
          <StatCard label="연속 달성" value={`${streak}일`} accent="pink" />
          <StatCard
            label="오늘 기록"
            value={todayLog ? "작성 완료" : "작성 전"}
            accent="green"
          />
        </View>

        <RetroCard accent="pink" style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressLabel}>오늘 진행률</Text>
              <Text style={styles.completeText}>
                {stats.completed} / {stats.total}개 완료
              </Text>
            </View>
            <Text style={styles.percentText}>{stats.rate}%</Text>
          </View>
          <PixelProgressBar value={stats.rate} />
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

      <View
        style={[
          styles.ctaDock,
          {
            paddingBottom: Math.max(insets.bottom, 10),
          },
        ]}
      >
        <PrimaryButton
          label="오늘 기록하기"
          onPress={() => navigation.navigate("Write")}
          style={styles.ctaButton}
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
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 27,
    letterSpacing: 0.4,
  },
  statusRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  progressCard: {
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: DESIGN.borders.pixel,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressLabel: {
    marginBottom: 3,
    color: DESIGN.colors.yellow,
    fontFamily: DESIGN.fonts.pixelKo,
    fontSize: 15,
    fontWeight: "900",
  },
  percentText: {
    color: DESIGN.colors.yellow,
    fontFamily: DESIGN.fonts.score,
    fontSize: 26,
    fontWeight: "900",
  },
  completeText: {
    color: DESIGN.colors.cyan,
    fontFamily: DESIGN.fonts.pixelKo,
    fontSize: 12,
    fontWeight: "800",
  },
  todoList: {
    marginBottom: 14,
    padding: 12,
    borderWidth: DESIGN.borders.pixel,
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
    padding: 12,
    borderWidth: DESIGN.borders.pixel,
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
  ctaDock: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    borderTopWidth: 2,
    borderTopColor: DESIGN.colors.cyan,
    backgroundColor: "rgba(5, 5, 5, 0.96)",
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  ctaButton: {
    minHeight: 60,
    borderWidth: DESIGN.borders.pixel,
  },
});
