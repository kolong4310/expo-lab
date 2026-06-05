import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { getLogsByDate, getLoggedDates, WorkLog } from '../database/db';

// 한국어 설정
LocaleConfig.locales['ko'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘'
};
LocaleConfig.defaultLocale = 'ko';

export default function CalendarScreen() {
  const navigation = useNavigation<any>();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [logs, setLogs] = useState<WorkLog[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  const loadData = () => {
    const dates = getLoggedDates();
    const marks: any = {};
    dates.forEach(date => {
      marks[date] = { marked: true, dotColor: '#6366f1' };
    });
    
    if (marks[selectedDate]) {
      marks[selectedDate] = { ...marks[selectedDate], selected: true, selectedColor: '#6366f1' };
    } else {
      marks[selectedDate] = { selected: true, selectedColor: '#6366f1' };
    }
    setMarkedDates(marks);

    const dayLogs = getLogsByDate(selectedDate);
    setLogs(dayLogs);
  };

  const renderItem = ({ item }: { item: WorkLog }) => (
    <TouchableOpacity 
      className="bg-white p-4 rounded-2xl flex-row items-center mb-3 border border-slate-100 shadow-sm"
      onPress={() => navigation.navigate('Detail', { log: item })}
      activeOpacity={0.7}
    >
      <View className="flex-1 mr-2">
        <Text className="text-base font-bold text-slate-900 mb-0.5" numberOfLines={1}>{item.title}</Text>
        <Text className="text-xs text-slate-500" numberOfLines={1}>
          {item.content || '내용 없음'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />
      <View className="flex-row justify-between items-center px-6 py-4 bg-white border-b border-slate-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 justify-center">
          <Ionicons name="arrow-back" size={26} color="#1e293b" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-900">캘린더</Text>
        <View className="w-10" />
      </View>

      <View className="bg-white pb-2 rounded-b-[40px] shadow-md shadow-slate-200">
        <Calendar
          onDayPress={(day: any) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: '#6366f1',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#6366f1',
            arrowColor: '#6366f1',
            monthTextColor: '#1e293b',
            textMonthFontWeight: '900',
            textDayHeaderFontWeight: '600',
            dotColor: '#6366f1',
            calendarBackground: 'transparent',
          }}
        />
      </View>

      <View className="flex-row justify-between items-center px-6 mt-8 mb-4">
        <Text className="text-xl font-black text-slate-900">{selectedDate.replace(/-/g, '. ')}</Text>
        <Text className="text-sm font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
          {logs.length}개의 기록
        </Text>
      </View>

      <FlatList
        data={logs}
        renderItem={renderItem}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        ListEmptyComponent={
          <View className="items-center mt-12">
            <Text className="text-base text-slate-400 font-medium">이 날은 기록이 없어요 💨</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
