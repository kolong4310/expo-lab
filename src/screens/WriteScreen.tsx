import React, { useEffect, useMemo, useState } from "react";
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
import {
  addLog,
  getLogById,
  updateLog,
} from "../database/repositories/logsRepository";
import { WorkLog } from "../database/types";
import { TranslationKey } from "../i18n/translations";
import { useTranslation } from "../i18n/useTranslation";
import { goHome } from "../navigation/homeNavigation";
import { RootStackScreenProps } from "../navigation/types";
import { DESIGN } from "../theme/design";
import { formatLocalDate } from "../utils/date";

const MOODS = [
  { labelKey: "mood.best", value: "best" },
  { labelKey: "mood.good", value: "good" },
  { labelKey: "mood.normal", value: "normal" },
  { labelKey: "mood.hard", value: "hard" },
] satisfies { labelKey: TranslationKey; value: string }[];

const DEFAULT_TAGS = [
  "개발",
  "공부",
  "운동",
  "회고",
  "ReactNative",
  "SQLite",
  "UI",
];

interface GrowthFeedbackInput {
  tags: string[];
  mood: string;
  selectedGoalCount: number;
  isEditMode: boolean;
}

const buildGrowthFeedback = ({
  tags,
  mood,
  selectedGoalCount,
  isEditMode,
}: GrowthFeedbackInput): TranslationKey => {
  if (isEditMode) {
    return "write.feedbackEdit";
  }

  if (selectedGoalCount > 0) {
    return "write.feedbackWithGoal";
  }

  if (tags.length > 0) {
    return "write.feedbackWithTag";
  }

  if (mood && mood !== "good") {
    return "write.feedbackWithMood";
  }

  return "write.feedbackDefault";
};

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

export default function WriteScreen({
  navigation,
  route,
}: RootStackScreenProps<"Write">) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const logId = route.params?.logId;
  const editingLog = useMemo(
    () => (logId !== undefined ? getLogById(logId) : null),
    [logId],
  );

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
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      Alert.alert(
        t("write.alertTitleRequired"),
        t("write.alertTitleRequiredMessage"),
      );
      return;
    }

    try {
      const logData: WorkLog = {
        id: editingLog?.id,
        title: trimmedTitle,
        daily_summary: dailySummary,
        tags: selectedTags.join(","),
        content,
        learned,
        issue,
        solution,
        memo,
        mood,
        date: editingLog
          ? editingLog.date
          : route.params?.date || formatLocalDate(),
      };

      if (editingLog) {
        updateLog(logData);
      } else {
        addLog(logData);
      }

      const feedbackKey = buildGrowthFeedback({
        tags: selectedTags,
        mood,
        selectedGoalCount: 0,
        isEditMode: Boolean(editingLog),
      });

      Alert.alert(t("write.feedbackTitle"), t(feedbackKey), [
        { text: t("write.feedbackConfirm"), onPress: () => goHome(navigation) },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert(t("write.saveFailedTitle"), t("write.saveFailedMessage"));
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
          title={editingLog ? t("write.editTitle") : t("write.createTitle")}
          onBack={() => navigation.goBack()}
          onHome={() => goHome(navigation)}
        />

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
        >
          <RetroCard accent="yellow" style={styles.inputCard}>
            <PixelSectionTitle>{t("write.titleLabel")}</PixelSectionTitle>
            <RetroInput
              value={title}
              onChangeText={setTitle}
              placeholder={t("write.titlePlaceholder")}
              style={styles.titleInput}
            />
          </RetroCard>

          <InsightInput
            label={t("write.summaryLabel")}
            value={dailySummary}
            onChangeText={setDailySummary}
            placeholder={t("write.summaryPlaceholder")}
            minHeight={72}
          />

          <InsightInput
            label={t("write.contentLabel")}
            value={content}
            onChangeText={setContent}
            placeholder={t("write.contentPlaceholder")}
            minHeight={120}
          />
          <InsightInput
            label={t("write.learnedLabel")}
            value={learned}
            onChangeText={setLearned}
            placeholder={t("write.learnedPlaceholder")}
          />

          <RetroCard accent="purple" style={styles.supportCard}>
            <TouchableOpacity
              style={styles.supportHeader}
              onPress={() => setDetailsOpen((open) => !open)}
              activeOpacity={0.75}
            >
              <View>
                <Text style={styles.supportTitle}>
                  {t("write.additionalTitle")}
                </Text>
                <Text style={styles.supportDescription}>
                  {t("write.additionalDescription")}
                </Text>
              </View>
              <Text style={styles.supportToggle}>
                {detailsOpen ? t("write.closeDetails") : t("write.openDetails")}
              </Text>
            </TouchableOpacity>

            {detailsOpen && (
              <View style={styles.supportBody}>
                <SupplementalInput
                  label={t("write.issueLabel")}
                  value={issue}
                  onChangeText={setIssue}
                  placeholder={t("write.issuePlaceholder")}
                />
                <SupplementalInput
                  label={t("write.solutionLabel")}
                  value={solution}
                  onChangeText={setSolution}
                  placeholder={t("write.solutionPlaceholder")}
                />
                <SupplementalInput
                  label={t("write.memoLabel")}
                  value={memo}
                  onChangeText={setMemo}
                  placeholder={t("write.memoPlaceholder")}
                />
              </View>
            )}
          </RetroCard>

          <RetroCard accent="green" style={styles.supportCard}>
            <PixelSectionTitle>{t("write.moodLabel")}</PixelSectionTitle>
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
                    {t(item.labelKey)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </RetroCard>

          <RetroCard accent="purple" style={styles.supportCard}>
            <PixelSectionTitle>{t("write.tagsLabel")}</PixelSectionTitle>
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
            label={editingLog ? t("write.update") : t("write.save")}
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
    paddingHorizontal: 20,
    backgroundColor: DESIGN.colors.bg,
  },
  inputCard: {
    padding: 20,
    marginTop: 16,
  },
  titleInput: {
    fontWeight: "600",
    fontSize: 18,
  },
  textInput: {
    fontSize: 16,
    color: DESIGN.colors.text,
    lineHeight: 24,
  },
  supportCard: {
    marginTop: 16,
    padding: 20,
  },
  supportHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  supportTitle: {
    color: DESIGN.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  supportDescription: {
    marginTop: 4,
    color: DESIGN.colors.textDim,
    fontSize: 12,
  },
  supportToggle: {
    color: DESIGN.colors.primaryLight,
    fontSize: 12,
    fontWeight: "600",
  },
  supportBody: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: DESIGN.colors.border,
  },
  supplementalField: {
    paddingTop: 12,
  },
  supplementalLabel: {
    marginBottom: 6,
    color: DESIGN.colors.textDim,
    fontSize: 12,
    fontWeight: "600",
  },
  supplementalInput: {
    minHeight: 76,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    borderRadius: DESIGN.radius.input,
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
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    borderRadius: DESIGN.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: DESIGN.colors.bgSecondary,
  },
  moodChipSelected: {
    backgroundColor: DESIGN.colors.primary,
    borderColor: DESIGN.colors.primary,
  },
  moodText: {
    color: DESIGN.colors.text,
    fontWeight: "600",
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
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    borderRadius: DESIGN.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: DESIGN.colors.bgSecondary,
  },
  tagChipSelected: {
    backgroundColor: "rgba(108,99,255,0.18)",
    borderColor: DESIGN.colors.primary,
  },
  tagText: {
    fontSize: 13,
    color: DESIGN.colors.text,
    fontWeight: "600",
  },
  ctaDock: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    borderTopWidth: 1,
    borderTopColor: DESIGN.colors.border,
    backgroundColor: "rgba(11,15,20,0.96)",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  ctaButton: {
    minHeight: 56,
  },
});
