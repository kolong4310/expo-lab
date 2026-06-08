import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addLog, updateLog, WorkLog } from '../database/db';
import { DESIGN } from '../theme/design';
import RetroCard from '../components/RetroCard';
import RetroButton from '../components/RetroButton';

const MOODS = [
  { label: 'BEST', value: 'best' },
  { label: 'GOOD', value: 'good' },
  { label: 'NORM', value: 'normal' },
  { label: 'HARD', value: 'hard' },
];

const DEFAULT_TAGS = ['개발', '공부', '운동', '회고', 'ReactNative', 'SQLite', 'UI'];

const InsightInput = ({ label, value, onChangeText, placeholder, isBig = false }: any) => (
  <RetroCard accent={isBig ? 'pink' : 'cyan'} style={styles.inputCard}>
    <Text style={styles.inputLabel}>{label}</Text>
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
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Text style={styles.headerButtonText}>BACK</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{editingLog ? 'EDIT LOG' : 'NEW LOG'}</Text>
          <View style={styles.headerButton} />
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
            placeholder="오늘의 성장을 한 문장으로"
            isBig
          />

          <RetroCard accent="yellow" style={styles.inputCard}>
            <Text style={styles.inputLabel}>QUEST TITLE</Text>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="무엇을 클리어했나요?"
              placeholderTextColor={DESIGN.colors.textDim}
              selectionColor={DESIGN.colors.primary}
            />
          </RetroCard>

          <RetroCard accent="green" style={styles.inputCard}>
            <Text style={styles.inputLabel}>MOOD</Text>
            <View style={styles.moodRow}>
              {MOODS.map(item => (
                <TouchableOpacity
                  key={item.value}
                  style={[styles.moodChip, mood === item.value && styles.moodChipSelected]}
                  onPress={() => setMood(item.value)}
                >
                  <Text style={[styles.moodText, mood === item.value && styles.moodTextSelected]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </RetroCard>

          <RetroCard accent="purple" style={styles.inputCard}>
            <Text style={styles.inputLabel}>TAG</Text>
            <View style={styles.tagRow}>
              {DEFAULT_TAGS.map(tag => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.tagChip, selectedTags.includes(tag) && styles.tagChipSelected]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={styles.tagText}>#{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </RetroCard>

          <InsightInput label="진행 기록" value={content} onChangeText={setContent} placeholder="오늘 진행한 내용을 기록하세요." />
          <InsightInput label="획득한 경험치" value={learned} onChangeText={setLearned} placeholder="새로 배운 점은 무엇인가요?" />
          <InsightInput label="장애물 / 해결" value={issue} onChangeText={setIssue} placeholder="막힌 점과 해결 과정을 적어보세요." />
          <InsightInput label="메모" value={memo} onChangeText={setMemo} placeholder="다음 퀘스트를 위한 메모" />
        </ScrollView>

        <RetroButton
          label={editingLog ? '수정 완료' : '저장하기'}
          style={[styles.saveButton, { bottom: insets.bottom + 20 }]}
          onPress={handleSave}
        />
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
    borderBottomWidth: DESIGN.borders.heavy,
    borderBottomColor: DESIGN.colors.border,
  },
  headerButton: {
    width: 70,
  },
  headerButtonText: {
    fontFamily: 'monospace',
    color: DESIGN.colors.primaryLight,
    fontWeight: '900',
  },
  headerTitle: {
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: '900',
    color: DESIGN.colors.yellow,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: DESIGN.colors.bg,
  },
  inputCard: {
    padding: 14,
    marginTop: 22,
  },
  inputLabel: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '900',
    color: DESIGN.colors.primaryLight,
    marginBottom: 12,
  },
  titleInput: {
    minHeight: 44,
    color: DESIGN.colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  textInput: {
    minHeight: 86,
    fontSize: 16,
    color: DESIGN.colors.text,
    lineHeight: 24,
  },
  bigInput: {
    minHeight: 90,
    fontSize: 22,
    fontWeight: '900',
    color: DESIGN.colors.primary,
  },
  moodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  moodChip: {
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  moodChipSelected: {
    backgroundColor: DESIGN.colors.primary,
    borderColor: DESIGN.colors.yellow,
  },
  moodText: {
    fontFamily: 'monospace',
    color: DESIGN.colors.text,
    fontWeight: '900',
    fontSize: 12,
  },
  moodTextSelected: {
    color: DESIGN.colors.text,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.purple,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tagChipSelected: {
    backgroundColor: DESIGN.colors.primary,
    borderColor: DESIGN.colors.yellow,
  },
  tagText: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: DESIGN.colors.text,
    fontWeight: '900',
  },
  saveButton: {
    position: 'absolute',
    left: 24,
    right: 24,
  },
});
