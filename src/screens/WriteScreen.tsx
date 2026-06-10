import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import PrimaryButton from "../components/PrimaryButton";
import PixelSectionTitle from "../components/ui/PixelSectionTitle";
import RetroCard from "../components/ui/RetroCard";
import RetroInput from "../components/ui/RetroInput";
import { addLog, updateLog, WorkLog } from "../database/db";
import { DESIGN } from "../theme/design";
import { formatLocalDate } from "../utils/date";

const MOODS = [
  { label: "최고", value: "best" },
  { label: "좋음", value: "good" },
  { label: "보통", value: "normal" },
  { label: "힘듦", value: "hard" },
];

const DEFAULT_TAGS = [
  "개발",
  "공부",
  "운동",
  "회고",
  "ReactNative",
  "SQLite",
  "UI",
];

const InsightInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  minHeight = 88,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  minHeight?: number;
}) => (
  <RetroCard accent="cyan" style={styles.inputCard}>
    <PixelSectionTitle>{label}</PixelSectionTitle>
    <TextInput
      style={[styles.textInput, { minHeight }]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={DESIGN.colors.textDim}
      multiline
      textAlignVertical="top"
      selectionColor={DESIGN.colors.primary}
    />
  </RetroCard>
);

const SupplementalInput = ({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}) => (
  <View style={styles.supplementalField}>
    <Text style={styles.supplementalLabel}>{label}</Text>
    <TextInput
      style={styles.supplementalInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={DESIGN.colors.textDim}
      multiline
      textAlignVertical="top"
      selectionColor={DESIGN.colors.primary}
    />
  </View>
);

export default function WriteScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const params = route.params as { log?: WorkLog } | undefined;
  const editingLog = params?.log;

  const [title, setTitle] = useState("");
  const [dailySummary, setDailySummary] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [content, setContent] = useState("");
  const [learned, setLearned] = useState("");
  const [issue, setIssue] = useState("");
  const [solution, setSolution] = useState("");
  const [memo, setMemo] = useState("");
  const [mood, setMood] = useState("good");
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (editingLog) {
      setTitle(editingLog.title);
      setDailySummary(editingLog.daily_summary || "");
      setSelectedTags(editingLog.tags ? editingLog.tags.split(",") : []);
      setContent(editingLog.content || "");
      setLearned(editingLog.learned || "");
      setIssue(editingLog.issue || "");
      setSolution(editingLog.solution || "");
      setMemo(editingLog.memo || "");
      setMood(editingLog.mood || "good");
      setDetailsOpen(
        Boolean(editingLog.issue || editingLog.solution || editingLog.memo),
      );
    }
  }, [editingLog]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("알림", "제목을 입력해주세요.");
      return;
    }

    try {
      const logData: WorkLog = {
        id: editingLog?.id,
        title,
        daily_summary: dailySummary,
        tags: selectedTags.join(","),
        content,
        learned,
        issue,
        solution,
        memo,
        mood,
        date: editingLog ? editingLog.date : formatLocalDate(),
      };

      if (editingLog) {
        updateLog(logData);
        navigation.navigate("Detail", { log: logData });
      } else {
        addLog(logData);
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
        style={styles.keyboardContainer}
      >
        <AppHeader
          title={editingLog ? "기록 수정" : "오늘 기록"}
          onBack={() => navigation.goBack()}
          accent={DESIGN.colors.yellow}
        />

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
        >
          <RetroCard accent="yellow" style={styles.inputCard}>
            <PixelSectionTitle>업무 제목</PixelSectionTitle>
            <RetroInput
              value={title}
              onChangeText={setTitle}
              placeholder="오늘 어떤 업무를 진행했나요?"
              style={styles.titleInput}
            />
          </RetroCard>

          <InsightInput
            label="오늘의 한 줄"
            value={dailySummary}
            onChangeText={setDailySummary}
            placeholder="오늘 업무를 한 문장으로 요약하세요."
            minHeight={72}
          />

          <InsightInput
            label="상세 내용"
            value={content}
            onChangeText={setContent}
            placeholder="오늘 진행한 내용을 기록하세요."
            minHeight={120}
          />
          <InsightInput
            label="배운 점"
            value={learned}
            onChangeText={setLearned}
            placeholder="새로 배운 점은 무엇인가요?"
          />

          <RetroCard accent="purple" style={styles.supportCard}>
            <TouchableOpacity
              style={styles.supportHeader}
              onPress={() => setDetailsOpen((open) => !open)}
              activeOpacity={0.75}
            >
              <View>
                <Text style={styles.supportTitle}>추가 기록</Text>
                <Text style={styles.supportDescription}>
                  이슈 · 해결 방법 · 메모
                </Text>
              </View>
              <Text style={styles.supportToggle}>
                {detailsOpen ? "접기 -" : "펼치기 +"}
              </Text>
            </TouchableOpacity>

            {detailsOpen && (
              <View style={styles.supportBody}>
                <SupplementalInput
                  label="이슈"
                  value={issue}
                  onChangeText={setIssue}
                  placeholder="업무 중 막힌 점을 적어보세요."
                />
                <SupplementalInput
                  label="해결 방법"
                  value={solution}
                  onChangeText={setSolution}
                  placeholder="어떻게 해결했는지 적어보세요."
                />
                <SupplementalInput
                  label="메모"
                  value={memo}
                  onChangeText={setMemo}
                  placeholder="다음 업무를 위한 메모"
                />
              </View>
            )}
          </RetroCard>

          <RetroCard accent="green" style={styles.supportCard}>
            <PixelSectionTitle>오늘 상태</PixelSectionTitle>
            <View style={styles.moodRow}>
              {MOODS.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.moodChip,
                    mood === item.value && styles.moodChipSelected,
                  ]}
                  onPress={() => setMood(item.value)}
                >
                  <Text
                    style={[
                      styles.moodText,
                      mood === item.value && styles.moodTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </RetroCard>

          <RetroCard accent="purple" style={styles.supportCard}>
            <PixelSectionTitle>태그</PixelSectionTitle>
            <View style={styles.tagRow}>
              {DEFAULT_TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagChip,
                    selectedTags.includes(tag) && styles.tagChipSelected,
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={styles.tagText}>#{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </RetroCard>
        </ScrollView>

        <View
          style={[
            styles.ctaDock,
            {
              paddingBottom: Math.max(insets.bottom, 10),
            },
          ]}
        >
          <PrimaryButton
            label={editingLog ? "수정 완료" : "기록 저장"}
            onPress={handleSave}
            style={styles.ctaButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN.colors.bg,
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: DESIGN.colors.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    backgroundColor: DESIGN.colors.bg,
  },
  inputCard: {
    padding: 12,
    marginTop: 14,
    borderWidth: DESIGN.borders.pixel,
  },
  titleInput: {
    fontWeight: "900",
    fontSize: 18,
  },
  textInput: {
    fontSize: 16,
    color: DESIGN.colors.text,
    lineHeight: 24,
  },
  supportCard: {
    marginTop: 14,
    padding: 12,
    borderWidth: DESIGN.borders.pixel,
  },
  supportHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  supportTitle: {
    color: DESIGN.colors.yellow,
    fontFamily: DESIGN.fonts.pixelKo,
    fontSize: 15,
    fontWeight: "900",
  },
  supportDescription: {
    marginTop: 4,
    color: DESIGN.colors.textDim,
    fontSize: 12,
  },
  supportToggle: {
    color: DESIGN.colors.cyan,
    fontFamily: DESIGN.fonts.pixelKo,
    fontSize: 12,
    fontWeight: "900",
  },
  supportBody: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#343B49",
  },
  supplementalField: {
    paddingTop: 12,
  },
  supplementalLabel: {
    marginBottom: 6,
    color: DESIGN.colors.cyan,
    fontFamily: DESIGN.fonts.pixelKo,
    fontSize: 12,
    fontWeight: "900",
  },
  supplementalInput: {
    minHeight: 76,
    borderWidth: 1,
    borderColor: "#343B49",
    backgroundColor: DESIGN.colors.bgSecondary,
    color: DESIGN.colors.text,
    fontSize: 15,
    lineHeight: 22,
    padding: 10,
  },
  moodRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  moodChip: {
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.cyan,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: DESIGN.colors.bg,
  },
  moodChipSelected: {
    backgroundColor: DESIGN.colors.primary,
    borderColor: DESIGN.colors.yellow,
  },
  moodText: {
    fontFamily: DESIGN.fonts.title,
    color: DESIGN.colors.text,
    fontWeight: "900",
    fontSize: 12,
  },
  moodTextSelected: {
    color: DESIGN.colors.text,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagChip: {
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.purple,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: DESIGN.colors.bg,
  },
  tagChipSelected: {
    backgroundColor: DESIGN.colors.purple,
    borderColor: DESIGN.colors.yellow,
  },
  tagText: {
    fontFamily: DESIGN.fonts.pixelKo,
    fontSize: 13,
    color: DESIGN.colors.text,
    fontWeight: "900",
  },
  ctaDock: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    borderTopWidth: 2,
    borderTopColor: DESIGN.colors.cyan,
    backgroundColor: "rgba(5, 5, 5, 0.96)",
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  ctaButton: {
    minHeight: 60,
    borderWidth: DESIGN.borders.pixel,
  },
});
