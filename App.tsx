import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import WriteScreen from './src/screens/WriteScreen';
import DetailScreen from './src/screens/DetailScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import SearchScreen from './src/screens/SearchScreen';
import { initDatabase } from './src/database/db';
import { DESIGN } from './src/theme/design';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Midnight Insight Theme
const MidnightTheme = {
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

import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
...
function TabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'Home') {
            iconName = focused ? 'flash' : 'flash-outline';
          } else if (route.name === 'Archive') {
            iconName = focused ? 'layers' : 'layers-outline';
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: DESIGN.colors.secondary,
        tabBarInactiveTintColor: DESIGN.colors.textDim,
        tabBarStyle: {
          backgroundColor: DESIGN.colors.bg,
          borderTopWidth: 1,
          borderTopColor: DESIGN.colors.border,
          height: 72 + (insets.bottom > 0 ? insets.bottom - 10 : 0),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
          paddingTop: 12,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '900',
          letterSpacing: 1,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'ENGINE' }} />
      <Tab.Screen name="Archive" component={CalendarScreen} options={{ tabBarLabel: 'ARCHIVE' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  // 앱 시작 시 DB 초기화
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={MidnightTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: DESIGN.colors.bg } }}>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="Write" component={WriteScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
