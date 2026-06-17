import { NavigatorScreenParams } from "@react-navigation/native";
import { CompositeScreenProps } from "@react-navigation/native";
import { BottomTabScreenProps as ReactNavigationBottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StackScreenProps } from "@react-navigation/stack";

export type MainTabName = keyof BottomTabParamList;
export type DetailOrigin = "Today" | "Archive" | "Search";

export type BottomTabParamList = {
  Today: undefined;
  Archive: undefined;
  Report: undefined;
  Search: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  LanguageSelect: undefined;
  Main: NavigatorScreenParams<BottomTabParamList> | undefined;
  Write: { date?: string; logId?: number } | undefined;
  Detail: { logId: number; returnTo?: DetailOrigin };
  GoalManage: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type BottomTabScreenProps<T extends keyof BottomTabParamList> =
  CompositeScreenProps<
    ReactNavigationBottomTabScreenProps<BottomTabParamList, T>,
    StackScreenProps<RootStackParamList, "Main">
  >;
