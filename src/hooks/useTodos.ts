import { useCallback, useState } from "react";
import {
  addTodayOnlyGoal,
  deleteTodayOnlyGoal,
  getDailyGoalsWithStats,
  getTodayOnlyGoals,
  TodayOnlyGoal,
  toggleGoalCheck,
  toggleTodayOnlyGoal,
} from "../database/db";

export interface DailyTodo {
  goal_id: number;
  title: string;
  category: string;
  is_done: number;
  streak: number;
}

export const useTodos = (date: string) => {
  const [dailyTodos, setDailyTodos] = useState<DailyTodo[]>([]);
  const [todayOnlyTodos, setTodayOnlyTodos] = useState<TodayOnlyGoal[]>([]);

  const refreshTodos = useCallback(() => {
    setDailyTodos(getDailyGoalsWithStats(date));
    setTodayOnlyTodos(getTodayOnlyGoals(date));
  }, [date]);

  const addTodo = useCallback(
    (title: string) => {
      addTodayOnlyGoal(title, date);
      refreshTodos();
    },
    [date, refreshTodos],
  );

  const toggleDailyTodo = useCallback(
    (todo: DailyTodo) => {
      toggleGoalCheck(todo.goal_id, date, todo.is_done === 1 ? 0 : 1);
      refreshTodos();
    },
    [date, refreshTodos],
  );

  const toggleTodayOnlyTodo = useCallback(
    (todo: TodayOnlyGoal) => {
      if (todo.id === undefined) return;
      toggleTodayOnlyGoal(todo.id, todo.is_done === 1 ? 0 : 1);
      refreshTodos();
    },
    [refreshTodos],
  );

  const deleteTodo = useCallback(
    (id: number) => {
      deleteTodayOnlyGoal(id);
      refreshTodos();
    },
    [refreshTodos],
  );

  return {
    dailyTodos,
    todayOnlyTodos,
    refreshTodos,
    addTodo,
    toggleDailyTodo,
    toggleTodayOnlyTodo,
    deleteTodo,
  };
};
