import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Calendar, LocaleConfig } from "react-native-calendars";
import AppHeader from "../components/AppHeader";
import LogCard from "../components/LogCard";
import PrimaryButton from "../components/PrimaryButton";
import PixelSectionTitle from "../components/ui/PixelSectionTitle";
import RetroCard from "../components/ui/RetroCard";
import {
  getDailyGoalsWithCheck,
  getLoggedDates,
  getLogsByDate,
  WorkLog,
} from "../database/db";
import { DESIGN } from "../theme/design";
import { formatLocalDate } from "../utils/date";

LocaleConfig.locales["en"] = {
  monthNames: [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ],
  monthNamesShort: [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ],
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayNamesShort: ["S", "M", "T", "W", "T", "F", "S"],
  today: "TODAY",
};
LocaleConfig.defaultLocale = "en";

export default function CalendarScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(formatLocalDate());
  const [markedDates, setMarkedDates] = useState<any>({});
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [dailyGoals, setDailyGoals] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate]),
  );

  const loadData = () => {
    const dates = getLoggedDates();
    const marks: any = {};

    dates.forEach((date) => {
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

  const completedGoals = dailyGoals.filter((goal) => goal.is_done === 1);

  const renderArchiveLog = ({ item }: { item: WorkLog }) => (
    <LogCard
      log={item}
      onPress={() => navigation.navigate("Detail", { log: item })}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />

      <FlatList
        data={logs}
        renderItem={renderArchiveLog}
        keyExtractor={(item, index) =>
          item.id?.toString() ?? `${item.date}-${index}`
        }
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <AppHeader
              title="기록 보관함"
              subtitle="날짜별 업무 로그와 완료한 목표"
              accent={DESIGN.colors.cyan}
            />

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
                  textDisabledColor: "#3E4654",
                  dotColor: DESIGN.colors.yellow,
                  monthTextColor: DESIGN.colors.yellow,
                  arrowColor: DESIGN.colors.yellow,
                  textDayFontWeight: "900",
                  textMonthFontWeight: "900",
                  textDayHeaderFontWeight: "900",
                  textDayFontSize: 15,
                  textMonthFontSize: 18,
                  textDayHeaderFontSize: 12,
                }}
              />
            </RetroCard>

            <RetroCard accent="green" style={styles.datePanel}>
              <PixelSectionTitle>
                {selectedDate.replace(/-/g, ".")} 기록
              </PixelSectionTitle>
              <View style={styles.goalGrid}>
                {completedGoals.length > 0 ? (
                  completedGoals.map((goal) => (
                    <Text key={goal.goal_id} style={styles.goalGem}>
                      ■ {goal.title}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.emptyText}>
                    완료된 미션 기록이 없습니다.
                  </Text>
                )}
              </View>
              <PrimaryButton
                label="선택 날짜 기록 보기"
                onPress={() => {
                  if (logs[0]) navigation.navigate("Detail", { log: logs[0] });
                }}
                disabled={!logs[0]}
                style={!logs[0] ? styles.disabledButton : undefined}
              />
            </RetroCard>

            <PixelSectionTitle>기록 목록</PixelSectionTitle>
            {logs.length === 0 && (
              <RetroCard accent="purple" style={styles.emptyCard}>
                <Text style={styles.emptyText}>
                  선택한 날짜의 성장 기록이 없습니다.
                </Text>
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
    fontWeight: "900",
    marginBottom: 8,
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
