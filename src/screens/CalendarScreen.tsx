import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { getLogsByDate, getLoggedDates, getDailyGoalsWithCheck, getGrowthStats, WorkLog } from '../database/db';
import { DESIGN } from '../theme/design';

// Locale config
LocaleConfig.locales['en'] = {
  monthNames: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
  monthNamesShort: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  today: 'TODAY'
};
LocaleConfig.defaultLocale = 'en';

export default function CalendarScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [dailyGoals, setDailyGoals] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, rate: 0 });

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  const loadData = () => {
    const dates = getLoggedDates();
    const marks: any = {};
    dates.forEach(date => {
      marks[date] = { marked: true, dotColor: DESIGN.colors.secondary };
    });
    
    marks[selectedDate] = { 
      ...marks[selectedDate], 
      selected: true, 
      selectedColor: DESIGN.colors.text,
      selectedTextColor: DESIGN.colors.bg 
    };
    setMarkedDates(marks);

    setLogs(getLogsByDate(selectedDate));
    setDailyGoals(getDailyGoalsWithCheck(selectedDate));
    setStats(getGrowthStats(selectedDate));
  };

  const renderArchiveItem = ({ item }: { item: WorkLog }) => (
    <TouchableOpacity 
      style={styles.archiveItem}
      onPress={() => navigation.navigate('Detail', { log: item })}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.archiveItemTitle} numberOfLines={1}>{item.title}</Text>
        {item.daily_summary && <Text style={styles.archiveItemSummary} numberOfLines={1}>{item.daily_summary}</Text>}
      </View>
      <Ionicons name="arrow-forward-outline" size={16} color={DESIGN.colors.textMuted} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back-outline" size={28} color={DESIGN.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CALENDAR</Text>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search-outline" size={24} color={DESIGN.colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={logs}
        renderItem={renderArchiveItem}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 120 }]}
        ListHeaderComponent={
          <>
            <View style={styles.calendarWrapper}>
              <Calendar
                onDayPress={(day: any) => setSelectedDate(day.dateString)}
                markedDates={markedDates}
                theme={{
                  backgroundColor: DESIGN.colors.bg,
                  calendarBackground: DESIGN.colors.bg,
                  textSectionTitleColor: DESIGN.colors.textDim,
                  selectedDayBackgroundColor: DESIGN.colors.text,
                  selectedDayTextColor: DESIGN.colors.bg,
                  todayTextColor: DESIGN.colors.secondary,
                  dayTextColor: DESIGN.colors.text,
                  textDisabledColor: DESIGN.colors.textMuted,
                  dotColor: DESIGN.colors.secondary,
                  monthTextColor: DESIGN.colors.text,
                  indicatorColor: DESIGN.colors.primary,
                  textDayFontWeight: '500',
                  textMonthFontWeight: '900',
                  textDayHeaderFontWeight: '700',
                  textDayFontSize: 14,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 11,
                }}
              />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>목표 달성 현황</Text>
              <Text style={styles.dateText}>{stats.rate}% 완료</Text>
            </View>

            <View style={styles.goalContainer}>
              {dailyGoals.map(goal => (
                <View key={goal.goal_id} style={styles.goalRow}>
                  <Ionicons 
                    name={goal.is_done === 1 ? "checkmark-circle" : "ellipse-outline"} 
                    size={20} 
                    color={goal.is_done === 1 ? DESIGN.colors.secondary : DESIGN.colors.textMuted} 
                  />
                  <Text style={[styles.goalText, goal.is_done === 1 && styles.goalTextDone]}>{goal.title}</Text>
                </View>
              ))}
              {dailyGoals.length === 0 && <Text style={styles.emptyGoalText}>이 날은 등록된 목표가 없었습니다.</Text>}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>작성한 회고</Text>
              <Text style={styles.countText}>{logs.length}개</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>선택한 날짜의 회고 기록이 없습니다.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN.colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: DESIGN.colors.text,
    letterSpacing: 4,
  },
  searchButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  calendarWrapper: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  list: {
    paddingHorizontal: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: DESIGN.colors.textMuted,
    letterSpacing: 2,
  },
  dateText: {
    fontSize: 10,
    fontWeight: '800',
    color: DESIGN.colors.secondary,
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
    color: DESIGN.colors.textDim,
  },
  goalContainer: {
    backgroundColor: DESIGN.colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalText: {
    marginLeft: 10,
    fontSize: 14,
    color: DESIGN.colors.text,
    fontWeight: '500',
  },
  goalTextDone: {
    color: DESIGN.colors.textMuted,
    textDecorationLine: 'line-through',
  },
  emptyGoalText: {
    fontSize: 12,
    color: DESIGN.colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  archiveItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.colors.border,
  },
  archiveItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN.colors.text,
    marginBottom: 4,
  },
  archiveItemSummary: {
    fontSize: 12,
    color: DESIGN.colors.accent,
    fontStyle: 'italic',
  },
  emptyState: {
    marginTop: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: DESIGN.colors.textMuted,
  }
});
