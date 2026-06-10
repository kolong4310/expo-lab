import { NavigationProp } from "@react-navigation/native";
import { MainTabName, RootStackParamList } from "./types";

type RootNavigate = Pick<NavigationProp<RootStackParamList>, "navigate">;

export const goToMainTab = (navigation: RootNavigate, screen: MainTabName) => {
  navigation.navigate("Main", { screen });
};

export const goHome = (navigation: RootNavigate) => {
  goToMainTab(navigation, "Today");
};
