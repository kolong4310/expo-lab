import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import GrowthFeedbackModal from "../components/GrowthFeedbackModal";
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
import { LIGHT_PASTEL } from "../theme/lightPastel";
import { useAppTheme } from "../theme/useAppTheme";
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
}) => {
  const { mode } = useAppTheme();

  return (
    <RetroCard
      accent="cyan"
      style={[
        styles.inputCard,
        mode === "light" && { backgroundColor: LIGHT_PASTEL.paper },
      ]}
    >
      <PixelSectionTitle>{label}</PixelSectionTitle>
      <RetroInput
        style={[styles.textInput, { minHeight }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline
        textAlignVertical="top"
      />
    </RetroCard>
  );
};

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
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.supplementalField}>
      <Text style={[styles.supplementalLabel, { color: theme.colors.muted }]}>
        {label}
      </Text>
      <RetroInput
        style={[styles.supplementalInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline
        textAlignVertical="top"
      />
    </View>
  );
};

export default function WriteScreen({
  navigation,
  route,
}: RootStackScreenProps<"Write">) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { mode, theme } = useAppTheme();
  const screenBackground =
    mode === "light" ? LIGHT_PASTEL.background : theme.colors.background;
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
  const [feedbackKey, setFeedbackKey] = useState<TranslationKey | null>(null);

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

      setFeedbackKey(feedbackKey);
    } catch (error) {
      console.error(error);
      Alert.alert(t("write.saveFailedTitle"), t("write.saveFailedMessage"));
    }
  };

  const handleFeedbackConfirm = () => {
    setFeedbackKey(null);
    goHome(navigation);
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
        style={[
          styles.keyboardContainer,
          { backgroundColor: screenBackground },
        ]}
      >
        <AppHeader
          title={editingLog ? t("write.editTitle") : t("write.createTitle")}
          onBack={() => navigation.goBack()}
          onHome={() => goHome(navigation)}
        />

        <ScrollView
          style={[styles.content, { backgroundColor: "transparent" }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
        >
          <Text
            style={[
              styles.gentleHint,
              { color: theme.colors.muted },
              mode === "light" && styles.lightGentleHint,
            ]}
          >
            {t("write.gentleHint")}
          </Text>

          <RetroCard
            accent="yellow"
            style={[
              styles.inputCard,
              mode === "light" && { backgroundColor: LIGHT_PASTEL.yellow },
            ]}
          >
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

          <RetroCard
            accent="purple"
            style={[
              styles.supportCard,
              mode === "light" && { backgroundColor: LIGHT_PASTEL.paperWarm },
            ]}
          >
            <TouchableOpacity
              style={styles.supportHeader}
              onPress={() => setDetailsOpen((open) => !open)}
              activeOpacity={0.75}
            >
              <View>
                <Text
                  style={[styles.supportTitle, { color: theme.colors.text }]}
                >
                  {t("write.additionalTitle")}
                </Text>
                <Text
                  style={[
                    styles.supportDescription,
                    { color: theme.colors.muted },
                  ]}
                >
                  {t("write.additionalDescription")}
                </Text>
              </View>
              <Text
                style={[
                  styles.supportToggle,
                  {
                    color:
                      mode === "light"
                        ? LIGHT_PASTEL.greenText
                        : theme.colors.secondary,
                  },
                ]}
              >
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

          <RetroCard
            accent="green"
            style={[
              styles.supportCard,
              mode === "light" && { backgroundColor: LIGHT_PASTEL.mint },
            ]}
          >
            <PixelSectionTitle>{t("write.moodLabel")}</PixelSectionTitle>
            <View style={styles.moodRow}>
              {MOODS.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.moodChip,
                    {
                      borderColor:
                        mode === "light"
                          ? LIGHT_PASTEL.line
                          : theme.colors.border,
                      backgroundColor:
                        mode === "light"
                          ? LIGHT_PASTEL.paper
                          : theme.colors.surfaceAlt,
                    },
                    mood === item.value && {
                      backgroundColor:
                        mode === "light"
                          ? LIGHT_PASTEL.greenSoft
                          : theme.colors.primary,
                      borderColor:
                        mode === "light"
                          ? LIGHT_PASTEL.greenStrong
                          : theme.colors.primary,
                    },
                  ]}
                  onPress={() => setMood(item.value)}
                >
                  {mood === item.value && (
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color={
                        mode === "light"
                          ? LIGHT_PASTEL.greenStrong
                          : theme.colors.text
                      }
                      style={styles.chipIcon}
                    />
                  )}
                  <Text
                    style={[
                      styles.moodText,
                      { color: theme.colors.text },
                      mood === item.value && styles.moodTextSelected,
                      mood === item.value &&
                        mode === "light" && { color: LIGHT_PASTEL.greenText },
                    ]}
                  >
                    {t(item.labelKey)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </RetroCard>

          <RetroCard
            accent="purple"
            style={[
              styles.supportCard,
              mode === "light" && { backgroundColor: LIGHT_PASTEL.blue },
            ]}
          >
            <PixelSectionTitle>{t("write.tagsLabel")}</PixelSectionTitle>
            <View style={styles.tagRow}>
              {DEFAULT_TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagChip,
                    {
                      borderColor:
                        mode === "light"
                          ? LIGHT_PASTEL.line
                          : theme.colors.border,
                      backgroundColor:
                        mode === "light"
                          ? LIGHT_PASTEL.paper
                          : theme.colors.surfaceAlt,
                    },
                    selectedTags.includes(tag) && {
                      backgroundColor:
                        mode === "light"
                          ? LIGHT_PASTEL.greenSoft
                          : `${theme.colors.primary}29`,
                      borderColor:
                        mode === "light"
                          ? LIGHT_PASTEL.greenStrong
                          : theme.colors.primary,
                    },
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  {selectedTags.includes(tag) && (
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color={
                        mode === "light"
                          ? LIGHT_PASTEL.greenStrong
                          : theme.colors.surface
                      }
                      style={styles.chipIcon}
                    />
                  )}
                  <Text style={[styles.tagText, { color: theme.colors.text }]}>
                    #{tag}
                  </Text>
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
              borderTopColor: theme.colors.border,
              backgroundColor:
                mode === "light"
                  ? "rgba(247,243,233,0.97)"
                  : "rgba(11,16,16,0.96)",
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

      <GrowthFeedbackModal
        visible={feedbackKey !== null}
        title={t("write.feedbackTitle")}
        message={feedbackKey ? t(feedbackKey) : ""}
        confirmLabel={t("write.feedbackConfirm")}
        onConfirm={handleFeedbackConfirm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN.colors.bg,
  },
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  backgroundBlob: {
    position: "absolute",
    borderRadius: 999,
  },
  backgroundBlobMint: {
    top: 100,
    right: -130,
    width: 270,
    height: 270,
    backgroundColor: "rgba(221,242,210,0.48)",
  },
  backgroundBlobPeach: {
    bottom: 180,
    left: -130,
    width: 250,
    height: 250,
    backgroundColor: "rgba(247,221,191,0.36)",
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: DESIGN.colors.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputCard: {
    padding: 20,
    marginTop: 12,
    borderRadius: 26,
  },
  gentleHint: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 20,
  },
  lightGentleHint: {
    overflow: "hidden",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: LIGHT_PASTEL.peach,
  },
  titleInput: {
    fontWeight: "600",
    fontSize: 18,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 24,
  },
  supportCard: {
    marginTop: 16,
    padding: 20,
    borderRadius: 26,
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
    fontSize: 12,
    fontWeight: "600",
  },
  supplementalInput: {
    minHeight: 76,
    borderRadius: DESIGN.radius.input,
    fontSize: 15,
    lineHeight: 22,
  },
  moodRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  moodChip: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: DESIGN.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  moodText: {
    color: DESIGN.colors.text,
    fontWeight: "600",
    fontSize: 12,
  },
  moodTextSelected: {
    fontWeight: "700",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagChip: {
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: DESIGN.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    color: DESIGN.colors.text,
    fontWeight: "600",
  },
  chipIcon: {
    marginRight: 5,
  },
  ctaDock: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    borderTopWidth: 1,
    borderTopColor: DESIGN.colors.border,
    backgroundColor: "rgba(11,16,16,0.96)",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  ctaButton: {
    minHeight: 60,
    borderRadius: 26,
  },
});
