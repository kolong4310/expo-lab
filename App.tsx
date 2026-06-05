import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import WriteScreen from './src/screens/WriteScreen';
import DetailScreen from './src/screens/DetailScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import { initDatabase } from './src/database/db';

const Stack = createStackNavigator();

export default function App() {
  // 앱 시작 시 DB 초기화
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Write" component={WriteScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
          <Stack.Screen name="Calendar" component={CalendarScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
