import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const getTabIcon = (name: string) => {
    if (name === 'Home') return '★';
    if (name === 'Archive') return '▣';
    if (name === 'Search') return '⌕';
    return '⚙';
  };

  return (
    <Tab.Navigator
      id="RootTabs"
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: {
          backgroundColor: DESIGN.colors.bg,
        },
        tabBarIcon: ({ focused, color }) => {
          return (
            <View
              style={{
                borderWidth: focused ? DESIGN.borders.pixel : 0,
                borderColor: DESIGN.colors.mint,
                backgroundColor: focused ? DESIGN.colors.surface : 'transparent',
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 6,
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View>
                  <Text
                    style={{
                      color,
                      fontFamily: 'monospace',
                      fontWeight: '900',
                      fontSize: 17,
                      lineHeight: 20,
                    }}
                  >
                    {getTabIcon(route.name)}
                  </Text>
                </View>
              </View>
            </View>
          );
        },
        tabBarActiveTintColor: DESIGN.colors.mint,
        tabBarInactiveTintColor: DESIGN.colors.textDim,
        tabBarStyle: {
          backgroundColor: DESIGN.colors.bg,
          borderTopWidth: DESIGN.borders.heavy,
          borderTopColor: DESIGN.colors.border,
          height: 64 + (insets.bottom > 0 ? insets.bottom - 10 : 0),
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
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'TODAY' }} />
      <Tab.Screen name="Archive" component={CalendarScreen} options={{ tabBarLabel: 'ARCHIVE' }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ tabBarLabel: 'SEARCH' }} />
      <Tab.Screen name="System" component={GoalManageScreen} options={{ tabBarLabel: 'SYSTEM' }} />
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
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="GoalManage" component={GoalManageScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}
