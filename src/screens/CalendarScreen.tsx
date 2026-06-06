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
      marks[date] = { marked: true, dotColor: DESIGN.colors.primary };
    });
    
    marks[selectedDate] = { 
      ...marks[selectedDate], 
      selected: true, 
      selectedColor: DESIGN.colors.primary,
      selectedTextColor: '#FFFFFF' 
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
      activeOpacity={0.6}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.archiveItemTitle} numberOfLines={1}>{item.title}</Text>
        {item.daily_summary && <Text style={styles.archiveItemSummary} numberOfLines={1}>{item.daily_summary}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={16} color={DESIGN.colors.border} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>아카이브</Text>
      </View>

      <FlatList
        data={logs}
        renderItem={renderArchiveItem}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 40 }]}
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
                  selectedDayBackgroundColor: DESIGN.colors.primary,
                  selectedDayTextColor: '#FFFFFF',
                  todayTextColor: DESIGN.colors.primary,
                  dayTextColor: DESIGN.colors.text,
                  textDisabledColor: DESIGN.colors.border,
                  dotColor: DESIGN.colors.primary,
                  monthTextColor: DESIGN.colors.text,
                  indicatorColor: DESIGN.colors.primary,
                  textDayFontWeight: '500',
                  textMonthFontWeight: '700',
                  textDayHeaderFontWeight: '600',
                  textDayFontSize: 15,
                  textMonthFontSize: 17,
                  textDayHeaderFontSize: 12,
                }}
              />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>목표 달성 현황</Text>
              <View style={styles.rateBadge}>
                <Text style={styles.rateText}>{stats.rate}% 완료</Text>
              </View>
            </View>

            <View style={styles.goalContainer}>
              {dailyGoals.map(goal => (
                <View key={goal.goal_id} style={styles.goalRow}>
                  <Ionicons 
                    name={goal.is_done === 1 ? "checkmark-circle" : "ellipse-outline"} 
                    size={22} 
                    color={goal.is_done === 1 ? DESIGN.colors.primary : DESIGN.colors.border} 
                  />
                  <Text style={[styles.goalText, goal.is_done === 1 && styles.goalTextDone]}>{goal.title}</Text>
                </View>
              ))}
              {dailyGoals.length === 0 && <Text style={styles.emptyGoalText}>이 날은 기록된 목표가 없습니다.</Text>}
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: DESIGN.colors.border,
  },
  headerTitle: {
    ...DESIGN.typography.title,
    color: DESIGN.colors.text,
  },
  calendarWrapper: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  list: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN.colors.textDim,
    textTransform: 'uppercase',
  },
  rateBadge: {
    backgroundColor: DESIGN.colors.bgSecondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rateText: {
    fontSize: 13,
    fontWeight: '600',
    color: DESIGN.colors.primary,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN.colors.text,
  },
  goalContainer: {
    backgroundColor: DESIGN.colors.bgSecondary,
    padding: 20,
    borderRadius: 18,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalText: {
    marginLeft: 12,
    fontSize: 16,
    color: DESIGN.colors.text,
    fontWeight: '500',
  },
  goalTextDone: {
    color: DESIGN.colors.textDim,
    textDecorationLine: 'line-through',
  },
  emptyGoalText: {
    fontSize: 15,
    color: DESIGN.colors.textDim,
    textAlign: 'center',
  },
  archiveItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: DESIGN.colors.border,
  },
  archiveItemTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: DESIGN.colors.text,
    marginBottom: 4,
  },
  archiveItemSummary: {
    fontSize: 14,
    color: DESIGN.colors.primary,
    fontStyle: 'italic',
  },
  emptyState: {
    marginTop: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: DESIGN.colors.textDim,
  }
});
