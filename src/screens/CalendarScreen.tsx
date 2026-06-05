import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { getLogsByDate, getLoggedDates, WorkLog } from '../database/db';

const COLORS = {
  primary: '#4F46E5',
  background: '#FFFFFF',
  text: '#000000',
  textSecondary: '#666666',
  border: '#F2F2F2',
};

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
      marks[date] = { marked: true, dotColor: COLORS.primary };
    });
    
    if (marks[selectedDate]) {
      marks[selectedDate] = { ...marks[selectedDate], selected: true, selectedColor: COLORS.text };
    } else {
      marks[selectedDate] = { selected: true, selectedColor: COLORS.text };
    }
    setMarkedDates(marks);

    const dayLogs = getLogsByDate(selectedDate);
    setLogs(dayLogs);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Archive</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.calendarArea}>
        <Calendar
          onDayPress={(day: any) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: COLORS.text,
            selectedDayTextColor: COLORS.background,
            todayTextColor: COLORS.primary,
            arrowColor: COLORS.text,
            monthTextColor: COLORS.text,
            textMonthFontWeight: '800',
            textDayHeaderFontWeight: '600',
            dotColor: COLORS.primary,
            calendarBackground: 'transparent',
          }}
        />
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.dateText}>{selectedDate.replace(/-/g, '. ')}</Text>
        <Text style={styles.countText}>{logs.length} entries</Text>
      </View>

      <FlatList
        data={logs}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.logItem}
            onPress={() => navigation.navigate('Detail', { log: item })}
          >
            <Text style={styles.logTitle} numberOfLines={1}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={14} color={COLORS.border} />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  calendarArea: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 30,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  list: {
    paddingHorizontal: 30,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: 10,
  },
});
