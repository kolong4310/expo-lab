import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { getLogsByDate, getLoggedDates, getDailyGoalsWithCheck, WorkLog } from '../database/db';
import { DESIGN } from '../theme/design';
import RetroCard from '../components/ui/RetroCard';
import RetroButton from '../components/ui/RetroButton';
import PixelSectionTitle from '../components/ui/PixelSectionTitle';

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
      <Text style={styles.openMark}>{'>'}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />

      <FlatList
        data={logs}
        renderItem={renderArchiveLog}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={styles.screenTitle}>ARCHIVE</Text>
            <Text style={styles.screenSub}>성장 기록 보관소</Text>

            <RetroCard accent="cyan" style={styles.calendarCard}>
              <Calendar
                onDayPress={(day: any) => setSelectedDate(day.dateString)}
                markedDates={markedDates}
                markingType="custom"
                theme={{
                  backgroundColor: DESIGN.colors.surface,
                  calendarBackground: DESIGN.colors.surface,
                  textSectionTitleColor: DESIGN.colors.cyan,
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
              <PixelSectionTitle>{selectedDate.replace(/-/g, '.')} 기록</PixelSectionTitle>
              <View style={styles.goalGrid}>
                {completedGoals.length > 0 ? completedGoals.map(goal => (
                  <Text key={goal.goal_id} style={styles.goalGem}>■ {goal.title}</Text>
                )) : (
                  <Text style={styles.emptyText}>완료된 미션 기록이 없습니다.</Text>
                )}
              </View>
              <RetroButton
                label="선택 날짜 기록 보기"
                variant="secondary"
                onPress={() => {
                  if (logs[0]) navigation.navigate('Detail', { log: logs[0] });
                }}
                disabled={!logs[0]}
                style={!logs[0] ? styles.disabledButton : undefined}
              />
            </RetroCard>

            <PixelSectionTitle>기록 목록</PixelSectionTitle>
            {logs.length === 0 && (
              <RetroCard accent="purple" style={styles.emptyCard}>
                <Text style={styles.emptyText}>선택한 날짜의 성장 기록이 없습니다.</Text>
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
    paddingHorizontal: 24,
    paddingTop: 22,
  },
  screenTitle: {
    ...DESIGN.typography.largeTitle,
    color: DESIGN.colors.cyan,
  },
  screenSub: {
    fontFamily: DESIGN.fonts.pixelKo,
    color: DESIGN.colors.textDim,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 24,
  },
  calendarCard: {
    padding: 10,
    marginBottom: 24,
  },
  loggedDay: {
    borderWidth: 2,
    borderColor: DESIGN.colors.yellow,
    borderRadius: 3,
  },
  loggedDayText: {
    color: DESIGN.colors.yellow,
  },
  datePanel: {
    padding: 16,
    marginBottom: 28,
  },
  goalGrid: {
    marginBottom: 16,
  },
  goalGem: {
    fontFamily: DESIGN.fonts.pixelKo,
    color: DESIGN.colors.green,
    fontWeight: '900',
    marginBottom: 8,
  },
  archiveLog: {
    backgroundColor: DESIGN.colors.surface,
    borderWidth: DESIGN.borders.heavy,
    borderColor: DESIGN.colors.cyan,
    borderBottomColor: DESIGN.colors.yellow,
    borderRightColor: DESIGN.colors.primary,
    padding: 14,
    marginBottom: 12,
  },
  logDate: {
    fontFamily: DESIGN.fonts.title,
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
    fontFamily: DESIGN.fonts.title,
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
