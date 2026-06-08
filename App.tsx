import React, { useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
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

const AppTheme = {
  ...DefaultTheme,
  dark: true,
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

  const getTabIcon = (routeName: string, focused: boolean) => {
    if (routeName === 'Today') return focused ? 'star' : 'star-outline';
    if (routeName === 'Archive') return focused ? 'calendar' : 'calendar-outline';
    return focused ? 'search' : 'search-outline';
  };

  return (
    <Tab.Navigator
      id="RootTabs"
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: {
          backgroundColor: DESIGN.colors.bg,
        },
        tabBarIcon: ({ focused, color }) => (
          <View
            style={{
              borderWidth: DESIGN.borders.pixel,
              borderColor: focused ? DESIGN.colors.mint : '#252B36',
              backgroundColor: focused ? DESIGN.colors.surface : DESIGN.colors.bg,
              paddingHorizontal: 7,
              paddingVertical: 3,
              borderRadius: 4,
              borderRightColor: focused ? DESIGN.colors.pink : '#252B36',
              borderBottomColor: focused ? DESIGN.colors.yellow : '#252B36',
            }}
          >
            <Ionicons name={getTabIcon(route.name, focused) as any} size={19} color={color} />
          </View>
        ),
        tabBarActiveTintColor: DESIGN.colors.mint,
        tabBarInactiveTintColor: DESIGN.colors.textDim,
        tabBarStyle: {
          backgroundColor: DESIGN.colors.bg,
          borderTopWidth: DESIGN.borders.heavy,
          borderTopColor: DESIGN.colors.cyan,
          height: 68 + (insets.bottom > 0 ? insets.bottom - 10 : 0),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '900',
          fontFamily: 'monospace',
          letterSpacing: 0.5,
        },
      })}
    >
      <Tab.Screen name="Today" component={HomeScreen} options={{ tabBarLabel: 'TODAY' }} />
      <Tab.Screen name="Archive" component={CalendarScreen} options={{ tabBarLabel: 'ARCHIVE' }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarLabel: 'SEARCH' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: DESIGN.colors.bg }}>
        <NavigationContainer theme={AppTheme}>
          <Stack.Navigator
            id="RootStack"
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: DESIGN.colors.bg },
              cardOverlayEnabled: false,
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          >
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="Write" component={WriteScreen} />
            <Stack.Screen name="Detail" component={DetailScreen} />
            <Stack.Screen name="GoalManage" component={GoalManageScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}
