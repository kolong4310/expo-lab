import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  Calendar,
  CalendarProps,
  DateData,
  LocaleConfig,
} from "react-native-calendars";
import AppHeader from "../components/AppHeader";
import LogCard from "../components/LogCard";
import RetroCard from "../components/ui/RetroCard";
import {
  getLoggedDates,
  getLogsByDate,
} from "../database/repositories/logsRepository";
import { WorkLog } from "../database/types";
import { useTranslation } from "../i18n/useTranslation";
import { goHome } from "../navigation/homeNavigation";
import { BottomTabScreenProps } from "../navigation/types";
import { DESIGN } from "../theme/design";
import { useAppTheme } from "../theme/useAppTheme";
import { formatLocalDate } from "../utils/date";

LocaleConfig.locales.ko = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  today: "오늘",
};
LocaleConfig.defaultLocale = "ko";

export default function CalendarScreen({
  navigation,
}: BottomTabScreenProps<"Archive">) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { mode, theme } = useAppTheme();
  const fade = useRef(new Animated.Value(1)).current;
  const [selectedDate, setSelectedDate] = useState(formatLocalDate());
  const [markedDates, setMarkedDates] = useState<
    NonNullable<CalendarProps["markedDates"]>
  >({});
  const [logs, setLogs] = useState<WorkLog[]>([]);

  const loadData = useCallback(() => {
    const marks: NonNullable<CalendarProps["markedDates"]> = {};
    getLoggedDates().forEach((date) => {
      marks[date] = { marked: true, dotColor: theme.colors.secondary };
    });
    marks[selectedDate] = {
      ...marks[selectedDate],
      selected: true,
      selectedColor: theme.colors.primary,
      selectedTextColor:
        mode === "light" ? theme.colors.surface : theme.colors.text,
    };
    setMarkedDates(marks);
    setLogs(getLogsByDate(selectedDate));
  }, [
    mode,
    selectedDate,
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.surface,
    theme.colors.text,
  ]);

  useFocusEffect(useCallback(() => loadData(), [loadData]));

  const animateMonth = () => {
    fade.setValue(0.45);
    Animated.timing(fade, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle={mode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />
      <FlatList
        data={logs}
        renderItem={({ item }) => (
          <LogCard
            log={item}
            onPress={() => {
              if (item.id !== undefined) {
                navigation.navigate("Detail", {
                  logId: item.id,
                  returnTo: "Archive",
                });
              }
            }}
          />
        )}
        keyExtractor={(item, index) =>
          item.id?.toString() ?? `${item.date}-${index}`
        }
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 110 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <AppHeader
              title={t("archive.title")}
              onHome={() => goHome(navigation)}
            />
            <Animated.View style={{ opacity: fade }}>
              <RetroCard style={styles.calendarCard}>
                <Calendar
                  onDayPress={(day: DateData) =>
                    setSelectedDate(day.dateString)
                  }
                  onMonthChange={animateMonth}
                  markedDates={markedDates}
                  theme={{
                    backgroundColor: theme.colors.surface,
                    calendarBackground: theme.colors.surface,
                    textSectionTitleColor: theme.colors.muted,
                    selectedDayBackgroundColor: theme.colors.primary,
                    selectedDayTextColor:
                      mode === "light"
                        ? theme.colors.surface
                        : theme.colors.text,
                    todayTextColor: theme.colors.secondary,
                    dayTextColor: theme.colors.text,
                    textDisabledColor: mode === "light" ? "#B8C6BC" : "#424A58",
                    dotColor: theme.colors.secondary,
                    monthTextColor: theme.colors.text,
                    arrowColor: theme.colors.muted,
                    textDayFontWeight: "500",
                    textMonthFontWeight: "700",
                    textDayHeaderFontWeight: "500",
                    textDayFontSize: 14,
                    textMonthFontSize: 17,
                    textDayHeaderFontSize: 12,
                  }}
                />
              </RetroCard>
            </Animated.View>
            <View style={styles.sectionHeading}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {selectedDate.replace(/-/g, ".")}
              </Text>
              <Text style={[styles.count, { color: theme.colors.muted }]}>
                {t("archive.count", { count: logs.length })}
              </Text>
            </View>
            {logs.length === 0 && (
              <RetroCard style={styles.emptyCard}>
                <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                  {t("archive.emptyTitle")}
                </Text>
                <Text style={[styles.emptyText, { color: theme.colors.muted }]}>
                  {t("archive.emptyText")}
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
  container: { flex: 1 },
  list: { paddingHorizontal: 20, paddingTop: 12 },
  calendarCard: { marginBottom: 28, padding: 10 },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  count: { fontSize: 12, fontWeight: "600" },
  emptyCard: { padding: 24 },
  emptyTitle: { fontSize: 15, fontWeight: "700" },
  emptyText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
  },
});
