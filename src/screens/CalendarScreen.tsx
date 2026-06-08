import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { getLogsByDate, getLoggedDates, getDailyGoalsWithCheck, getGrowthStats, WorkLog } from '../database/db';
import { DESIGN } from '../theme/design';
import { retroStyles } from '../theme/retro';

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
    marks[date] = { marked: true, dotColor: DESIGN.colors.yellow };
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

  const renderTimelineItem = ({ item }: { item: WorkLog }) => (
    <TouchableOpacity 
      style={styles.timelineItem}
      onPress={() => navigation.navigate('Detail', { log: item })}
      activeOpacity={0.6}
    >
      <View style={styles.timelineLine} />
      <View style={styles.timelineDot} />
      <View style={styles.timelineContent}>
        <Text style={styles.timelineTitle}>{item.title}</Text>
        {item.daily_summary && <Text style={styles.timelineSummary}>"{item.daily_summary}"</Text>}
        {item.tags && (
          <View style={styles.tagRow}>
            {item.tags.split(',').map(tag => (
              <Text key={tag} style={styles.tagText}>#{tag}</Text>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>성장 아카이브</Text>
      </View>

      <FlatList
        data={logs}
        renderItem={renderTimelineItem}
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
                  calendarBackground: DESIGN.colors.surface,
                  textSectionTitleColor: DESIGN.colors.textDim,
                  selectedDayBackgroundColor: DESIGN.colors.primary,
                  selectedDayTextColor: '#FFFFFF',
                  todayTextColor: DESIGN.colors.yellow,
                  dayTextColor: DESIGN.colors.text,
                  textDisabledColor: DESIGN.colors.border,
                  dotColor: DESIGN.colors.primary,
                  monthTextColor: DESIGN.colors.yellow,
                  indicatorColor: DESIGN.colors.primary,
                  textDayFontWeight: '700',
                  textMonthFontWeight: '900',
                  textDayHeaderFontWeight: '900',
                  textDayFontSize: 15,
                  textMonthFontSize: 17,
                  textDayHeaderFontSize: 12,
                }}
              />
            </View>

            <View style={styles.archiveHeader}>
              <View style={styles.archiveDateInfo}>
                <Text style={styles.archiveDateText}>{selectedDate.replace(/-/g, ' / ')}</Text>
                <Text style={styles.archiveStatsText}>달성률 {stats.rate}%</Text>
              </View>
            </View>

            <View style={styles.goalsSummary}>
              <Text style={styles.sectionLabel}>완료한 목표</Text>
              <View style={styles.goalPillRow}>
                {dailyGoals.filter(g => g.is_done === 1).map(goal => (
                  <View key={goal.goal_id} style={styles.goalPill}>
                    <Text style={styles.goalPillText}>{goal.title}</Text>
                  </View>
                ))}
                {dailyGoals.filter(g => g.is_done === 1).length === 0 && (
                  <Text style={styles.emptyText}>완료한 목표가 없습니다.</Text>
                )}
              </View>
            </View>

            <Text style={styles.sectionLabel}>기록 타임라인</Text>
            {logs.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>기록된 회고가 없습니다.</Text>
              </View>
            )}
          </>
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
    borderBottomWidth: DESIGN.borders.pixel,
    borderBottomColor: DESIGN.colors.border,
  },
  headerTitle: {
    ...DESIGN.typography.title,
    color: DESIGN.colors.text,
  },
  calendarWrapper: {
    ...retroStyles.card,
    marginTop: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  list: {
    paddingHorizontal: 24,
  },
  archiveHeader: {
    marginTop: 24,
    marginBottom: 20,
  },
  archiveDateInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  archiveDateText: {
    fontSize: 22,
    fontWeight: '900',
    color: DESIGN.colors.yellow,
    fontFamily: 'monospace',
  },
  archiveStatsText: {
    fontSize: 15,
    fontWeight: '900',
    color: DESIGN.colors.primary,
    fontFamily: 'monospace',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '900',
    color: DESIGN.colors.primaryLight,
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 16,
  },
  goalsSummary: {
    marginBottom: 8,
  },
  goalPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  goalPill: {
    ...retroStyles.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  goalPillText: {
    fontSize: 14,
    fontWeight: '900',
    color: DESIGN.colors.text,
    fontFamily: 'monospace',
  },
  timelineItem: {
    flexDirection: 'row',
    paddingBottom: 32,
  },
  timelineLine: {
    position: 'absolute',
    left: 4,
    top: 10,
    bottom: 0,
    width: 2,
    backgroundColor: DESIGN.colors.primary,
  },
  timelineDot: {
    width: 9,
    height: 9,
    borderRadius: 2,
    backgroundColor: DESIGN.colors.yellow,
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 20,
    ...retroStyles.card,
    padding: 14,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: DESIGN.colors.text,
    fontFamily: 'monospace',
    marginBottom: 6,
  },
  timelineSummary: {
    fontSize: 15,
    color: DESIGN.colors.primary,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
  },
  tagText: {
    fontSize: 13,
    color: DESIGN.colors.textDim,
    marginRight: 10,
  },
  emptyState: {
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 15,
    color: DESIGN.colors.textDim,
  }
});
