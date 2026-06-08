import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import WriteScreen from './src/screens/WriteScreen';
import DetailScreen from './src/screens/DetailScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import SearchScreen from './src/screens/SearchScreen';
import GoalManageScreen from './src/screens/GoalManageScreen';
import { initDatabase } from './src/database/db';
import { DESIGN } from './src/theme/design';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Apple Design Theme
const AppleTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: DESIGN.colors.bg,
    card: DESIGN.colors.bg,
    text: DESIGN.colors.text,
    border: DESIGN.colors.border,
    primary: DESIGN.colors.primary,
  },
};

function TabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      id="RootTabs"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'Home') {
            iconName = focused ? 'sparkles' : 'sparkles-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: DESIGN.colors.primary,
        tabBarInactiveTintColor: DESIGN.colors.textDim,
        tabBarStyle: {
          backgroundColor: DESIGN.colors.bg,
          borderTopWidth: 0.5,
          borderTopColor: DESIGN.colors.border,
          height: 64 + (insets.bottom > 0 ? insets.bottom - 10 : 0),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: '오늘의 성장' }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarLabel: '아카이브' }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarLabel: '검색' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={AppleTheme}>
        <Stack.Navigator
          id="RootStack"
          screenOptions={{ headerShown: false, cardStyle: { backgroundColor: DESIGN.colors.bg } }}
        >
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="Write" component={WriteScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="GoalManage" component={GoalManageScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
