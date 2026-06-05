import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { getLogsByDate, getLoggedDates, WorkLog } from '../database/db';

const COLORS = {
  primary: '#6366f1',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#0f172a',
  textSecondary: '#64748b',
  border: '#f1f5f9',
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
      marks[selectedDate] = { ...marks[selectedDate], selected: true, selectedColor: COLORS.primary };
    } else {
      marks[selectedDate] = { selected: true, selectedColor: COLORS.primary };
    }
    setMarkedDates(marks);

    const dayLogs = getLogsByDate(selectedDate);
    setLogs(dayLogs);
  };

  const renderItem = ({ item }: { item: WorkLog }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Detail', { log: item })}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardPreview} numberOfLines={1}>
          {item.content || '내용 없음'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>캘린더</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={(day: any) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: COLORS.primary,
            selectedDayTextColor: '#ffffff',
            todayTextColor: COLORS.primary,
            arrowColor: COLORS.primary,
            monthTextColor: COLORS.text,
            textMonthFontWeight: '900',
            textDayHeaderFontWeight: '600',
            dotColor: COLORS.primary,
            calendarBackground: 'transparent',
          }}
        />
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listHeaderTitle}>{selectedDate.replace(/-/g, '. ')}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{logs.length}개의 기록</Text>
        </View>
      </View>

      <FlatList
        data={logs}
        renderItem={renderItem}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>이 날은 기록이 없어요 💨</Text>
          </View>
        }
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  calendarContainer: {
    backgroundColor: COLORS.surface,
    paddingBottom: 8,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 16,
  },
  listHeaderTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
  },
  badge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardContent: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  cardPreview: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
