import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import WriteScreen from './src/screens/WriteScreen';
import DetailScreen from './src/screens/DetailScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import { initDatabase } from './src/database/db';
import { DESIGN } from './src/theme/design';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
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
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
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
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="Write" component={WriteScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
