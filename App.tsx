import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import HomeScreen from "./src/screens/HomeScreen";
import WriteScreen from "./src/screens/WriteScreen";
import DetailScreen from "./src/screens/DetailScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import ReportScreen from "./src/screens/ReportScreen";
import SearchScreen from "./src/screens/SearchScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import GoalManageScreen from "./src/screens/GoalManageScreen";
import LanguageSelectScreen from "./src/screens/LanguageSelectScreen";
import { initDatabase } from "./src/database/db";
import { I18nProvider } from "./src/i18n/I18nProvider";
import { useTranslation } from "./src/i18n/useTranslation";
import { DESIGN } from "./src/theme/design";
import { ThemeProvider } from "./src/theme/ThemeProvider";
import { useAppTheme } from "./src/theme/useAppTheme";
import {
  LIGHT_PASTEL,
  LIGHT_PASTEL_CARD_SHADOW,
} from "./src/theme/lightPastel";
import PixelTabIcon from "./src/components/ui/PixelTabIcon";
import {
  BottomTabParamList,
  MainTabName,
  RootStackParamList,
} from "./src/navigation/types";

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function TabNavigator() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { mode, theme } = useAppTheme();
  const screenBackground =
    mode === "light" ? LIGHT_PASTEL.background : theme.colors.background;

  const getTabIcon = (
    routeName: MainTabName,
    focused: boolean,
  ): keyof typeof Ionicons.glyphMap => {
    if (routeName === "Today") return focused ? "star" : "star-outline";
    if (routeName === "Archive")
      return focused ? "calendar" : "calendar-outline";
    if (routeName === "Report")
      return focused ? "bar-chart" : "bar-chart-outline";
    if (routeName === "Search") return focused ? "search" : "search-outline";
    return focused ? "settings" : "settings-outline";
  };

  const getTabAccent = (routeName: MainTabName) => {
    if (routeName === "Today") return theme.colors.primary;
    if (routeName === "Archive") return theme.colors.success;
    if (routeName === "Report") return theme.colors.secondary;
    if (routeName === "Search") return theme.colors.primary;
    return theme.colors.muted;
  };

  return (
    <Tab.Navigator
      id="RootTabs"
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: {
          backgroundColor: screenBackground,
        },
        tabBarIcon: ({ focused, color }) => (
          <PixelTabIcon
            name={getTabIcon(route.name, focused)}
            color={color}
            focused={focused}
            accent={getTabAccent(route.name)}
          />
        ),
        tabBarActiveTintColor:
          mode === "light" ? LIGHT_PASTEL.green : theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          backgroundColor:
            mode === "light" ? LIGHT_PASTEL.paper : theme.colors.surface,
          borderTopWidth: mode === "light" ? 2 : 1,
          borderTopColor:
            mode === "light" ? LIGHT_PASTEL.border : theme.colors.border,
          height: 76 + (insets.bottom > 0 ? insets.bottom - 10 : 0),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          ...(mode === "light" ? LIGHT_PASTEL_CARD_SHADOW : {}),
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          fontFamily: DESIGN.fonts.title,
          marginTop: 2,
        },
      })}
    >
      <Tab.Screen
        name="Today"
        component={HomeScreen}
        options={{ tabBarLabel: t("tabs.today") }}
      />
      <Tab.Screen
        name="Archive"
        component={CalendarScreen}
        options={{ tabBarLabel: t("tabs.archive") }}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{ tabBarLabel: t("tabs.report") }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarLabel: t("tabs.search") }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: t("tabs.settings") }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { selectedLanguage } = useTranslation();
  const { mode, theme } = useAppTheme();
  const screenBackground =
    mode === "light" ? LIGHT_PASTEL.background : theme.colors.background;
  const navigationTheme = {
    ...DefaultTheme,
    dark: theme.mode === "dark",
    colors: {
      ...DefaultTheme.colors,
      background: screenBackground,
      card: screenBackground,
      text: theme.colors.text,
      border: theme.colors.border,
      primary: theme.colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        id="RootStack"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: screenBackground },
          cardOverlayEnabled: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        {selectedLanguage ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="Write" component={WriteScreen} />
            <Stack.Screen name="Detail" component={DetailScreen} />
            <Stack.Screen name="GoalManage" component={GoalManageScreen} />
          </>
        ) : (
          <Stack.Screen
            name="LanguageSelect"
            component={LanguageSelectScreen}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [databaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    initDatabase();
    setDatabaseReady(true);
  }, []);

  if (!databaseReady) {
    return <View style={{ flex: 1, backgroundColor: DESIGN.colors.bg }} />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <I18nProvider>
          <ThemedAppRoot />
        </I18nProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function ThemedAppRoot() {
  const { mode, theme } = useAppTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          mode === "light" ? LIGHT_PASTEL.background : theme.colors.background,
      }}
    >
      <AppNavigator />
    </View>
  );
}
