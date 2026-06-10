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
  isBig = false,
}: any) => (
  <RetroCard accent={isBig ? "pink" : "cyan"} style={styles.inputCard}>
    <PixelSectionTitle>{label}</PixelSectionTitle>
    <TextInput
      style={[styles.textInput, isBig && styles.bigInput]}
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
          contentContainerStyle={{ paddingBottom: insets.bottom + 170 }}
        >
          <InsightInput
            label="오늘의 한 줄"
            value={dailySummary}
            onChangeText={setDailySummary}
            placeholder="오늘의 성장을 한 문장으로"
            isBig
          />

          <RetroCard accent="yellow" style={styles.inputCard}>
            <PixelSectionTitle>업무 제목</PixelSectionTitle>
            <RetroInput
              value={title}
              onChangeText={setTitle}
              placeholder="오늘 어떤 업무를 진행했나요?"
              style={styles.titleInput}
            />
          </RetroCard>

          <RetroCard accent="green" style={styles.inputCard}>
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

          <RetroCard accent="purple" style={styles.inputCard}>
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

          <InsightInput
            label="상세 내용"
            value={content}
            onChangeText={setContent}
            placeholder="오늘 진행한 내용을 기록하세요."
          />
          <InsightInput
            label="배운 점"
            value={learned}
            onChangeText={setLearned}
            placeholder="새로 배운 점은 무엇인가요?"
          />
          <InsightInput
            label="막힌 점"
            value={issue}
            onChangeText={setIssue}
            placeholder="업무 중 막힌 점을 적어보세요."
          />
          <InsightInput
            label="해결 방법"
            value={solution}
            onChangeText={setSolution}
            placeholder="어떻게 해결했는지 적어보세요."
          />
          <InsightInput
            label="메모"
            value={memo}
            onChangeText={setMemo}
            placeholder="다음 업무를 위한 메모"
          />
        </ScrollView>

        <View style={[styles.ctaWrap, { bottom: insets.bottom + 16 }]}>
          <PrimaryButton
            label={editingLog ? "수정 완료" : "기록 저장"}
            onPress={handleSave}
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
    paddingHorizontal: 24,
    backgroundColor: DESIGN.colors.bg,
  },
  inputCard: {
    padding: 14,
    marginTop: 24,
  },
  titleInput: {
    fontWeight: "900",
    fontSize: 18,
  },
  textInput: {
    minHeight: 96,
    fontSize: 16,
    color: DESIGN.colors.text,
    lineHeight: 25,
  },
  bigInput: {
    minHeight: 108,
    fontSize: 21,
    fontWeight: "900",
    color: DESIGN.colors.primary,
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
  ctaWrap: {
    position: "absolute",
    left: 24,
    right: 24,
  },
});
