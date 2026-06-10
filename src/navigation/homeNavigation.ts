export interface HomeNavigation {
  navigate: (name: string, params?: object) => void;
}

export type MainTabName = "Today" | "Archive" | "Search";

export const goToMainTab = (
  navigation: HomeNavigation,
  screen: MainTabName,
) => {
  navigation.navigate("Main", { screen });
};

export const goHome = (navigation: HomeNavigation) => {
  goToMainTab(navigation, "Today");
};
