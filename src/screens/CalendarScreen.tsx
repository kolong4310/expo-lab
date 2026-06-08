import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { getLogsByDate, getLoggedDates, getDailyGoalsWithCheck, WorkLog } from '../database/db';
import { DESIGN } from '../theme/design';
import RetroCard from '../components/RetroCard';
import RetroButton from '../components/RetroButton';

LocaleConfig.locales['en'] = {
  monthNames: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
  monthNamesShort: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  today: 'TODAY',
};
LocaleConfig.defaultLocale = 'en';

export default function CalendarScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [dailyGoals, setDailyGoals] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  const loadData = () => {
    const dates = getLoggedDates();
    const marks: any = {};

    dates.forEach(date => {
      marks[date] = {
        marked: true,
        dotColor: DESIGN.colors.yellow,
        customStyles: {
          container: styles.loggedDay,
          text: styles.loggedDayText,
        },
      };
    });

    marks[selectedDate] = {
      ...marks[selectedDate],
      selected: true,
      selectedColor: DESIGN.colors.primary,
      selectedTextColor: DESIGN.colors.text,
    };

    setMarkedDates(marks);
    setLogs(getLogsByDate(selectedDate));
    setDailyGoals(getDailyGoalsWithCheck(selectedDate));
  };

  const completedGoals = dailyGoals.filter(goal => goal.is_done === 1);

  const renderArchiveLog = ({ item }: { item: WorkLog }) => (
    <TouchableOpacity style={styles.archiveLog} onPress={() => navigation.navigate('Detail', { log: item })}>
      <Text style={styles.logDate}>{item.date}</Text>
      <Text style={styles.logTitle}>{item.title}</Text>
      {item.daily_summary && <Text style={styles.logSummary} numberOfLines={2}>{item.daily_summary}</Text>}
      <Text style={styles.openMark}>▶</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />

      <FlatList
        data={logs}
        renderItem={renderArchiveLog}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={styles.screenTitle}>ARCHIVE</Text>
            <Text style={styles.screenSub}>기록 열람</Text>

            <RetroCard accent="cyan" style={styles.calendarCard}>
              <Calendar
                onDayPress={(day: any) => setSelectedDate(day.dateString)}
                markedDates={markedDates}
                markingType="custom"
                theme={{
                  backgroundColor: DESIGN.colors.surface,
                  calendarBackground: DESIGN.colors.surface,
                  textSectionTitleColor: DESIGN.colors.primaryLight,
                  selectedDayBackgroundColor: DESIGN.colors.primary,
                  selectedDayTextColor: DESIGN.colors.text,
                  todayTextColor: DESIGN.colors.yellow,
                  dayTextColor: DESIGN.colors.text,
                  textDisabledColor: '#3E4654',
                  dotColor: DESIGN.colors.yellow,
                  monthTextColor: DESIGN.colors.yellow,
                  arrowColor: DESIGN.colors.yellow,
                  textDayFontWeight: '900',
                  textMonthFontWeight: '900',
                  textDayHeaderFontWeight: '900',
                  textDayFontSize: 15,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 12,
                }}
              />
            </RetroCard>

            <RetroCard accent="green" style={styles.datePanel}>
              <Text style={styles.panelTitle}>{selectedDate.replace(/-/g, '.')} LOG</Text>
              <View style={styles.goalGrid}>
                {completedGoals.length > 0 ? completedGoals.map(goal => (
                  <Text key={goal.goal_id} style={styles.goalGem}>■ {goal.title}</Text>
                )) : (
                  <Text style={styles.emptyText}>완료된 미션 기록이 없습니다.</Text>
                )}
              </View>
              <RetroButton
                label="오늘 기록 보기"
                variant="secondary"
                onPress={() => {
                  if (logs[0]) navigation.navigate('Detail', { log: logs[0] });
                }}
                disabled={!logs[0]}
                style={!logs[0] ? styles.disabledButton : undefined}
              />
            </RetroCard>

            <Text style={styles.sectionTitle}>SELECTED RECORDS</Text>
            {logs.length === 0 && (
              <RetroCard accent="purple" style={styles.emptyCard}>
                <Text style={styles.emptyText}>선택한 날짜의 기록이 없습니다.</Text>
              </RetroCard>
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
  list: {
    paddingHorizontal: DESIGN.spacing.padding,
    paddingTop: 22,
  },
  screenTitle: {
    ...DESIGN.typography.largeTitle,
    color: DESIGN.colors.primaryLight,
  },
  screenSub: {
    fontFamily: 'monospace',
    color: DESIGN.colors.textDim,
    fontWeight: '900',
    marginTop: 4,
    marginBottom: 18,
  },
  calendarCard: {
    padding: 10,
    marginBottom: 18,
  },
  loggedDay: {
    borderWidth: 2,
    borderColor: DESIGN.colors.yellow,
    borderRadius: 4,
  },
  loggedDayText: {
    color: DESIGN.colors.yellow,
  },
  datePanel: {
    padding: 16,
    marginBottom: 24,
  },
  panelTitle: {
    fontFamily: 'monospace',
    color: DESIGN.colors.yellow,
    fontWeight: '900',
    fontSize: 15,
    marginBottom: 12,
  },
  goalGrid: {
    marginBottom: 16,
  },
  goalGem: {
    fontFamily: 'monospace',
    color: DESIGN.colors.mint,
    fontWeight: '900',
    marginBottom: 8,
  },
  sectionTitle: {
    ...DESIGN.typography.title,
    color: DESIGN.colors.text,
    marginBottom: 12,
  },
  archiveLog: {
    backgroundColor: DESIGN.colors.surface,
    borderWidth: DESIGN.borders.heavy,
    borderColor: DESIGN.colors.primaryLight,
    borderBottomColor: DESIGN.colors.yellow,
    borderRightColor: DESIGN.colors.primary,
    padding: 14,
    marginBottom: 12,
  },
  logDate: {
    fontFamily: 'monospace',
    color: DESIGN.colors.purple,
    fontWeight: '900',
    marginBottom: 4,
  },
  logTitle: {
    color: DESIGN.colors.text,
    fontWeight: '900',
    fontSize: 17,
    marginBottom: 6,
  },
  logSummary: {
    color: DESIGN.colors.textDim,
    lineHeight: 20,
  },
  openMark: {
    position: 'absolute',
    right: 12,
    top: 16,
    color: DESIGN.colors.primary,
    fontFamily: 'monospace',
    fontWeight: '900',
  },
  emptyCard: {
    padding: 20,
  },
  emptyText: {
    color: DESIGN.colors.textDim,
    lineHeight: 21,
  },
  disabledButton: {
    opacity: 0.45,
  },
});
