import { Ionicons } from "@expo/vector-icons";
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
import { AppLanguage } from "../i18n/languages";
import { useTranslation } from "../i18n/useTranslation";
import { goHome } from "../navigation/homeNavigation";
import { BottomTabScreenProps } from "../navigation/types";
import { DESIGN } from "../theme/design";
import { LIGHT_PASTEL, LIGHT_PASTEL_CARD_SHADOW } from "../theme/lightPastel";
import { useAppTheme } from "../theme/useAppTheme";
import { formatLocalDate } from "../utils/date";

interface CalendarLocaleDefinition {
  monthNames: string[];
  monthNamesShort: string[];
  dayNames: string[];
  dayNamesShort: string[];
  today: string;
}

const CALENDAR_LOCALES = {
  ko: {
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
  },
  en: {
    monthNames: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    monthNamesShort: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
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
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    today: "Today",
  },
  ja: {
    monthNames: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
    monthNamesShort: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
    dayNames: [
      "日曜日",
      "月曜日",
      "火曜日",
      "水曜日",
      "木曜日",
      "金曜日",
      "土曜日",
    ],
    dayNamesShort: ["日", "月", "火", "水", "木", "金", "土"],
    today: "今日",
  },
  zh: {
    monthNames: [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ],
    monthNamesShort: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
    dayNames: [
      "星期日",
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
    ],
    dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"],
    today: "今天",
  },
} satisfies Record<AppLanguage, CalendarLocaleDefinition>;

LocaleConfig.locales.ko = CALENDAR_LOCALES.ko;
LocaleConfig.locales.en = CALENDAR_LOCALES.en;
LocaleConfig.locales.ja = CALENDAR_LOCALES.ja;
LocaleConfig.locales.zh = CALENDAR_LOCALES.zh;

LocaleConfig.defaultLocale = "ko";

export default function CalendarScreen({
  navigation,
}: BottomTabScreenProps<"Archive">) {
  const insets = useSafeAreaInsets();
  const { language, t } = useTranslation();
  const { mode, theme } = useAppTheme();
  LocaleConfig.defaultLocale = language;
  const screenBackground =
    mode === "light" ? LIGHT_PASTEL.background : theme.colors.background;
  const fade = useRef(new Animated.Value(1)).current;
  const [selectedDate, setSelectedDate] = useState(formatLocalDate());
  const [markedDates, setMarkedDates] = useState<
    NonNullable<CalendarProps["markedDates"]>
  >({});
  const [logs, setLogs] = useState<WorkLog[]>([]);

  const loadData = useCallback(() => {
    const marks: NonNullable<CalendarProps["markedDates"]> = {};
    getLoggedDates().forEach((date) => {
      marks[date] = {
        marked: true,
        dotColor:
          mode === "light" ? LIGHT_PASTEL.green : theme.colors.secondary,
      };
    });
    marks[selectedDate] = {
      ...marks[selectedDate],
      selected: true,
      selectedColor:
        mode === "light" ? LIGHT_PASTEL.greenStrong : theme.colors.primary,
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
      style={[styles.container, { backgroundColor: screenBackground }]}
    >
      <View pointerEvents="none" style={styles.backgroundDecor}>
        <View style={[styles.backgroundBlob, styles.backgroundBlobMint]} />
        <View style={[styles.backgroundBlob, styles.backgroundBlobPeach]} />
      </View>
      <StatusBar
        barStyle={mode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={screenBackground}
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
              <RetroCard
                style={[
                  styles.calendarCard,
                  mode === "light" && styles.lightCalendarCard,
                ]}
              >
                <Calendar
                  key={language}
                  current={selectedDate}
                  onDayPress={(day: DateData) =>
                    setSelectedDate(day.dateString)
                  }
                  onMonthChange={animateMonth}
                  markedDates={markedDates}
                  theme={{
                    backgroundColor:
                      mode === "light"
                        ? LIGHT_PASTEL.paper
                        : theme.colors.surface,
                    calendarBackground:
                      mode === "light"
                        ? LIGHT_PASTEL.paper
                        : theme.colors.surface,
                    textSectionTitleColor: theme.colors.muted,
                    selectedDayBackgroundColor:
                      mode === "light"
                        ? LIGHT_PASTEL.greenStrong
                        : theme.colors.primary,
                    selectedDayTextColor:
                      mode === "light"
                        ? theme.colors.surface
                        : theme.colors.text,
                    todayTextColor:
                      mode === "light"
                        ? LIGHT_PASTEL.greenText
                        : theme.colors.secondary,
                    dayTextColor: theme.colors.text,
                    textDisabledColor: mode === "light" ? "#B8C6BC" : "#424A58",
                    dotColor:
                      mode === "light"
                        ? LIGHT_PASTEL.green
                        : theme.colors.secondary,
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
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text },
                  mode === "light" && styles.lightDateBadge,
                ]}
              >
                {selectedDate.replace(/-/g, ".")}
              </Text>
              <Text
                style={[
                  styles.count,
                  { color: theme.colors.muted },
                  mode === "light" && styles.lightCountBadge,
                ]}
              >
                {t("archive.count", { count: logs.length })}
              </Text>
            </View>
            {logs.length === 0 && (
              <RetroCard
                style={[
                  styles.emptyCard,
                  mode === "light" && styles.lightEmptyCard,
                ]}
              >
                <View
                  style={[
                    styles.emptyIcon,
                    {
                      backgroundColor:
                        mode === "light"
                          ? LIGHT_PASTEL.yellow
                          : theme.colors.surfaceAlt,
                    },
                  ]}
                >
                  <Ionicons
                    name="book-outline"
                    size={22}
                    color={theme.colors.warning}
                  />
                </View>
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
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  backgroundBlob: {
    position: "absolute",
    borderRadius: 999,
  },
  backgroundBlobMint: {
    top: 40,
    right: -110,
    width: 260,
    height: 260,
    backgroundColor: "rgba(221,242,210,0.62)",
  },
  backgroundBlobPeach: {
    bottom: 90,
    left: -120,
    width: 240,
    height: 240,
    backgroundColor: "rgba(247,221,191,0.42)",
  },
  list: { paddingHorizontal: 20, paddingTop: 12 },
  calendarCard: { marginBottom: 28, padding: 10 },
  lightCalendarCard: {
    borderWidth: 2,
    borderColor: LIGHT_PASTEL.border,
    borderRadius: 30,
    backgroundColor: LIGHT_PASTEL.paper,
    ...LIGHT_PASTEL_CARD_SHADOW,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700" },
  lightDateBadge: {
    overflow: "hidden",
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: LIGHT_PASTEL.mint,
  },
  count: { fontSize: 12, fontWeight: "600" },
  lightCountBadge: {
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: LIGHT_PASTEL.blue,
  },
  emptyCard: { padding: 24 },
  lightEmptyCard: {
    alignItems: "center",
    borderWidth: 2,
    borderColor: LIGHT_PASTEL.border,
    borderRadius: 26,
    backgroundColor: LIGHT_PASTEL.paperWarm,
    ...LIGHT_PASTEL_CARD_SHADOW,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderRadius: 18,
    transform: [{ rotate: "-3deg" }],
  },
  emptyTitle: { fontSize: 15, fontWeight: "700" },
  emptyText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },
});
