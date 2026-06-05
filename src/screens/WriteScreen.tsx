import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { addLog, updateLog, WorkLog } from '../database/db';

const COLORS = {
  primary: '#4F46E5',
  background: '#FFFFFF',
  text: '#000000',
  textSecondary: '#666666',
  border: '#F2F2F2',
  inputBg: '#FAFAFA',
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
      Alert.alert('알림', '제목은 성장의 시작입니다.');
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
        Alert.alert('성공', '새로운 발자취를 남겼습니다.', [
          { text: '확인', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '저장 중 문제가 발생했습니다.');
    }
  };

  const MinimalInput = ({ label, value, onChangeText, placeholder, height = 100 }: any) => (
    <View style={styles.inputSection}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.textInput, { height }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#CCCCCC"
        multiline
        textAlignVertical="top"
        selectionColor={COLORS.primary}
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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="close" size={28} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{editingLog ? 'Edit Log' : 'New Journal'}</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Main Title - Borderless */}
          <TextInput 
            style={styles.mainTitleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="어떤 성장이 있었나요?"
            placeholderTextColor="#DDDDDD"
            selectionColor={COLORS.primary}
          />

          <View style={styles.divider} />

          {/* Mood Selector - Minimalist */}
          <View style={styles.moodRow}>
            {MOODS.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.moodCircle,
                  mood === item.value && styles.moodCircleSelected
                ]}
                onPress={() => setMood(item.value)}
              >
                <Text style={styles.moodEmoji}>{item.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <MinimalInput 
            label="What I did"
            value={content}
            onChangeText={setContent}
            placeholder="오늘의 주요 성과를 텍스트로 기록하세요."
          />

          <MinimalInput 
            label="Learned"
            value={learned}
            onChangeText={setLearned}
            placeholder="새롭게 깨달은 지식이나 통찰"
          />

          <MinimalInput 
            label="Problem"
            value={issue}
            onChangeText={setIssue}
            placeholder="직면했던 장애물"
          />

          <MinimalInput 
            label="Solution"
            value={solution}
            onChangeText={setSolution}
            placeholder="어떻게 극복하셨나요?"
          />

          <MinimalInput 
            label="Memo"
            value={memo}
            onChangeText={setMemo}
            placeholder="그 외 남기고 싶은 기록"
            height={80}
          />
        </ScrollView>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>{editingLog ? 'Update' : 'Complete'}</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
  },
  mainTitleInput: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 20,
    paddingVertical: 10,
    letterSpacing: -1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
  moodRow: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  moodCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  moodCircleSelected: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.text,
  },
  moodEmoji: {
    fontSize: 22,
  },
  inputSection: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  textInput: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 26,
    fontWeight: '400',
  },
  saveButton: {
    position: 'absolute',
    bottom: 40,
    left: 30,
    right: 30,
    height: 60,
    backgroundColor: COLORS.text, // Black
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
