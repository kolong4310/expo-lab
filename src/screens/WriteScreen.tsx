import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { addLog, updateLog, WorkLog } from '../database/db';
import { DESIGN } from '../theme/design';

const MOODS = [
  { emoji: '🔥', value: 'best' },
  { emoji: '✨', value: 'good' },
  { emoji: '☁️', value: 'normal' },
  { emoji: '🌊', value: 'hard' },
];

const DEFAULT_TAGS = ['개발', '공부', '운동', '회사', '회고', 'ReactNative', 'SQLite', 'UI'];

const InsightInput = ({ label, value, onChangeText, placeholder, isMantra = false }: any) => (
  <View style={[styles.inputGroup, isMantra && styles.mantraGroup]}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.textInput, isMantra && styles.mantraInput]}
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

  const [title, setTitle] = useState('');
  const [dailySummary, setDailySummary] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [learned, setLearned] = useState('');
  const [issue, setIssue] = useState('');
  const [solution, setSolution] = useState('');
  const [memo, setMemo] = useState('');
  const [mood, setMood] = useState('good');

  useEffect(() => {
    if (editingLog) {
      setTitle(editingLog.title);
      setDailySummary(editingLog.daily_summary || '');
      setSelectedTags(editingLog.tags ? editingLog.tags.split(',') : []);
      setContent(editingLog.content || '');
      setLearned(editingLog.learned || '');
      setIssue(editingLog.issue || '');
      setSolution(editingLog.solution || '');
      setMemo(editingLog.memo || '');
      setMood(editingLog.mood || 'good');
    }
  }, [editingLog]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('알림', '제목을 입력해주세요.');
      return;
    }

    try {
      const logData: WorkLog = {
        id: editingLog?.id,
        title,
        daily_summary: dailySummary,
        tags: selectedTags.join(','),
        content,
        learned,
        issue,
        solution,
        memo,
        mood,
        date: editingLog ? editingLog.date : new Date().toISOString().split('T')[0],
      };

      if (editingLog) {
        updateLog(logData);
        navigation.navigate('Detail', { log: logData });
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
      <StatusBar barStyle="dark-content" backgroundColor={DESIGN.colors.bg} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>취소</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{editingLog ? '기록 수정' : '새 기록'}</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        >
          <InsightInput 
            label="오늘의 한 줄"
            value={dailySummary}
            onChangeText={setDailySummary}
            placeholder="오늘을 한 문장으로 남긴다면?"
            isMantra
          />

          <View style={styles.divider} />

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>제목</Text>
            <TextInput 
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="무엇을 했나요?"
              placeholderTextColor={DESIGN.colors.textDim}
              selectionColor={DESIGN.colors.primary}
            />
          </View>

          <View style={styles.tagSection}>
            <Text style={styles.inputLabel}>태그</Text>
            <View style={styles.tagRow}>
              {DEFAULT_TAGS.map(tag => (
                <TouchableOpacity 
                  key={tag} 
                  style={[styles.tagChip, selectedTags.includes(tag) && styles.tagChipSelected]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[styles.tagText, selectedTags.includes(tag) && styles.tagTextSelected]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputLabelGroup}>
            <Text style={styles.inputLabel}>기분</Text>
            <View style={styles.moodRow}>
              {MOODS.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.moodBox,
                    mood === item.value && styles.moodBoxSelected
                  ]}
                  onPress={() => setMood(item.value)}
                >
                  <Text style={styles.moodEmoji}>{item.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <InsightInput 
            label="상세 내용"
            value={content}
            onChangeText={setContent}
            placeholder="오늘의 과정을 기록해보세요."
          />

          <InsightInput 
            label="배운 점"
            value={learned}
            onChangeText={setLearned}
            placeholder="새롭게 알게 된 것이 있나요?"
          />

          <InsightInput 
            label="문제와 해결"
            value={issue}
            onChangeText={setIssue}
            placeholder="어려웠던 점과 해결 방법을 적어보세요."
          />

          <InsightInput 
            label="메모"
            value={memo}
            onChangeText={setMemo}
            placeholder="기타 남기고 싶은 생각..."
          />
        </ScrollView>

        <TouchableOpacity 
          style={[styles.saveButton, { bottom: insets.bottom + 20 }]} 
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>{editingLog ? '수정 완료' : '저장하기'}</Text>
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: DESIGN.colors.border,
  },
  cancelBtn: {
    width: 60,
  },
  cancelBtnText: {
    fontSize: 17,
    color: DESIGN.colors.error,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: DESIGN.colors.text,
  },
  content: {
    flex: 1,
    backgroundColor: DESIGN.colors.bg,
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginTop: 32,
  },
  mantraGroup: {
    marginTop: 40,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: DESIGN.colors.textDim,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  mantraInput: {
    fontSize: 24,
    fontWeight: '600',
    color: DESIGN.colors.primary,
    fontStyle: 'italic',
    lineHeight: 32,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: DESIGN.colors.text,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.colors.border,
  },
  textInput: {
    fontSize: 17,
    color: DESIGN.colors.text,
    lineHeight: 26,
    minHeight: 44,
  },
  divider: {
    height: 1,
    backgroundColor: DESIGN.colors.border,
    marginTop: 32,
  },
  tagSection: {
    marginTop: 40,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: DESIGN.colors.bgSecondary,
    marginRight: 8,
    marginBottom: 8,
  },
  tagChipSelected: {
    backgroundColor: DESIGN.colors.primary,
  },
  tagText: {
    fontSize: 14,
    color: DESIGN.colors.text,
    fontWeight: '500',
  },
  tagTextSelected: {
    color: '#FFFFFF',
  },
  inputLabelGroup: {
    marginTop: 40,
  },
  moodRow: {
    flexDirection: 'row',
  },
  moodBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: DESIGN.colors.bgSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  moodBoxSelected: {
    backgroundColor: DESIGN.colors.primary + '20', // Transparent primary
    borderWidth: 2,
    borderColor: DESIGN.colors.primary,
  },
  moodEmoji: {
    fontSize: 22,
  },
  saveButton: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: 56,
    backgroundColor: DESIGN.colors.primary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
