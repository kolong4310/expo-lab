import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { addLog, updateLog, WorkLog } from '../database/db';

const COLORS = {
  primary: '#4F46E5',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  indigoSubtle: '#EEF2FF',
};

const MOODS = [
  { emoji: '🔥', label: '최고', value: 'best' },
  { emoji: '😀', label: '좋음', value: 'good' },
  { emoji: '🙂', label: '보통', value: 'normal' },
  { emoji: '😓', label: '힘듦', value: 'hard' },
];

export default function WriteScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as { log?: WorkLog } | undefined;
  const editingLog = params?.log;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [learned, setLearned] = useState('');
  const [issue, setIssue] = useState('');
  const [solution, setSolution] = useState('');
  const [memo, setMemo] = useState('');
  const [mood, setMood] = useState('good');

  useEffect(() => {
    if (editingLog) {
      setTitle(editingLog.title);
      setContent(editingLog.content || '');
      setLearned(editingLog.learned || '');
      setIssue(editingLog.issue || '');
      setSolution(editingLog.solution || '');
      setMemo(editingLog.memo || '');
      setMood(editingLog.mood || 'good');
    }
  }, [editingLog]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('알림', '오늘의 핵심 제목을 입력해주세요.');
      return;
    }

    try {
      const logData: WorkLog = {
        id: editingLog?.id,
        title,
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
        Alert.alert('성공', '기록이 수정되었습니다.', [
          { text: '확인', onPress: () => navigation.navigate('Detail', { log: logData }) }
        ]);
      } else {
        addLog(logData);
        Alert.alert('성공', '기록이 저장되었습니다.', [
          { text: '확인', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '저장 중 문제가 발생했습니다.');
    }
  };

  const CardInput = ({ label, value, onChangeText, placeholder, height = 120 }: any) => (
    <View style={styles.inputCard}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.textInput, { height }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        multiline
        textAlignVertical="top"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={28} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{editingLog ? '기록 수정' : '오늘의 기록'}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
        >
          {/* Title Area - Minimalist */}
          <TextInput 
            style={styles.mainTitleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="제목을 입력하세요"
            placeholderTextColor="#CBD5E1"
            selectionColor={COLORS.primary}
          />

          <View style={styles.sectionDivider} />

          {/* Mood Selector - Premium Style */}
          <Text style={styles.sectionTitle}>오늘의 컨디션</Text>
          <View style={styles.moodContainer}>
            {MOODS.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.moodItem,
                  mood === item.value && styles.moodItemSelected
                ]}
                onPress={() => setMood(item.value)}
              >
                <Text style={styles.moodEmoji}>{item.emoji}</Text>
                <Text style={[
                  styles.moodLabel,
                  mood === item.value && styles.moodLabelSelected
                ]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <CardInput 
            label="오늘 무엇을 했나요?"
            value={content}
            onChangeText={setContent}
            placeholder="오늘의 주요 성과와 작업 내용을 적어주세요."
          />

          <CardInput 
            label="배운 점"
            value={learned}
            onChangeText={setLearned}
            placeholder="새롭게 깨달은 지식이나 통찰이 있나요?"
          />

          <CardInput 
            label="어떤 문제가 있었나요?"
            value={issue}
            onChangeText={setIssue}
            placeholder="직면했던 기술적 혹은 심리적 장애물"
          />

          <CardInput 
            label="어떻게 해결했나요?"
            value={solution}
            onChangeText={setSolution}
            placeholder="문제 해결 과정과 시도했던 방법들"
          />

          <CardInput 
            label="추가 메모"
            value={memo}
            onChangeText={setMemo}
            placeholder="내일의 나에게 남기는 한 마디"
            height={100}
          />
        </ScrollView>

        <TouchableOpacity 
          style={styles.saveFab}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Ionicons name="checkmark" size={32} color={COLORS.white} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  mainTitleInput: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 10,
    paddingVertical: 10,
    letterSpacing: -1,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  moodItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'transparent',
    marginHorizontal: 4,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },
  moodItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  moodLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  moodLabelSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  inputCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
  },
  textInput: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  saveFab: {
    position: 'absolute',
    right: 24,
    bottom: 40,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 12,
  },
});
