import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAllLogs, WorkLog } from '../database/db';
import { Colors } from '../theme/theme'; // Still keeping colors for some cases if needed

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [logs, setLogs] = useState<WorkLog[]>([]);

  useFocusEffect(
    useCallback(() => {
      const data = getAllLogs();
      setLogs(data);
    }, [])
  );

  const renderItem = ({ item }: { item: WorkLog }) => (
    <TouchableOpacity 
      className="bg-white p-5 rounded-3xl flex-row items-center mb-4 shadow-sm border border-slate-100"
      onPress={() => navigation.navigate('Detail', { log: item })}
      activeOpacity={0.7}
    >
      <View className="flex-1 mr-2">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-lg font-bold text-slate-900 flex-1 mr-2" numberOfLines={1}>
            {item.title}
          </Text>
          <Text className="text-xs text-slate-400 font-medium">{item.date}</Text>
        </View>
        <Text className="text-sm text-slate-500 leading-5" numberOfLines={2}>
          {item.content || '설명이 없습니다.'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />
      <View className="flex-row justify-between items-center px-6 py-4">
        <View>
          <Text className="text-sm text-slate-400 mb-0.5">반가워요! 👋</Text>
          <Text className="text-3xl font-black text-slate-900 tracking-tight">오늘 뭐 했지?</Text>
        </View>
        <View className="flex-row">
          <TouchableOpacity 
            className="w-11 h-11 rounded-full bg-white justify-center items-center border border-slate-200 mr-2 shadow-sm"
            onPress={() => navigation.navigate('Calendar')}
          >
            <Ionicons name="calendar-outline" size={22} color="#1e293b" />
          </TouchableOpacity>
          <TouchableOpacity 
            className="w-11 h-11 rounded-full bg-white justify-center items-center border border-slate-200 shadow-sm"
            onPress={() => alert('검색 기능 준비 중!')}
          >
            <Ionicons name="search" size={22} color="#1e293b" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={logs}
        renderItem={renderItem}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center mt-32">
            <View className="w-20 h-20 rounded-full bg-white justify-center items-center mb-4 border border-slate-100 shadow-sm">
              <Ionicons name="document-text-outline" size={32} color="#6366f1" />
            </View>
            <Text className="text-lg font-bold text-slate-800 mb-1">아직 작성된 기록이 없어요.</Text>
            <Text className="text-sm text-slate-400">오늘의 소중한 기록을 남겨보세요! ✨</Text>
          </View>
        }
      />

      <TouchableOpacity 
        className="absolute right-6 bottom-8 w-16 h-16 rounded-full bg-indigo-600 justify-center items-center shadow-lg shadow-indigo-300"
        onPress={() => navigation.navigate('Write')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={36} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
