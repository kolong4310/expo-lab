import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { getLogsByDate, getLoggedDates, WorkLog } from '../database/db';
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
      marks[date] = { marked: true, dotColor: DESIGN.colors.secondary };
    });
    
    marks[selectedDate] = { 
      ...marks[selectedDate], 
      selected: true, 
      selectedColor: DESIGN.colors.text,
      selectedTextColor: DESIGN.colors.bg 
    };
    setMarkedDates(marks);

    const dayLogs = getLogsByDate(selectedDate);
    setLogs(dayLogs);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back-outline" size={28} color={DESIGN.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ARCHIVE</Text>
        <View style={{ width: 44 }} />
      </View>

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

      <View style={styles.listHeader}>
        <Text style={styles.selectedDateText}>{selectedDate.replace(/-/g, ' / ')}</Text>
        <Text style={styles.countText}>{logs.length} JOURNEYS</Text>
      </View>

      <FlatList
        data={logs}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.archiveItem}
            onPress={() => navigation.navigate('Detail', { log: item })}
          >
            <Text style={styles.archiveItemTitle} numberOfLines={1}>{item.title}</Text>
            <Ionicons name="arrow-forward-outline" size={16} color={DESIGN.colors.textMuted} />
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
  calendarWrapper: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    marginTop: 20,
    marginBottom: 20,
  },
  selectedDateText: {
    fontSize: 14,
    fontWeight: '800',
    color: DESIGN.colors.text,
    letterSpacing: 1,
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
    color: DESIGN.colors.textDim,
    letterSpacing: 1,
  },
  list: {
    paddingHorizontal: 28,
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
    flex: 1,
    marginRight: 10,
  },
});
