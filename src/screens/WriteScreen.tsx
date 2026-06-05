import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { addLog, updateLog, WorkLog } from '../database/db';

const COLORS = {
  primary: '#6366f1',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#0f172a',
  textSecondary: '#64748b',
  border: '#f1f5f9',
  indigo50: '#eef2ff',
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
      Alert.alert('알림', '오늘 한 일의 제목을 입력해주세요.');
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

  const InputLabel = ({ icon, label }: { icon: any, label: string }) => (
    <View style={styles.labelContainer}>
      <Ionicons name={icon} size={16} color={COLORS.primary} style={styles.labelIcon} />
      <Text style={styles.label}>{label}</Text>
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
            style={styles.headerButton}
          >
            <Ionicons name="close" size={26} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{editingLog ? '기록 수정' : '기록하기'}</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>{editingLog ? '완료' : '저장'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <InputLabel icon="happy-outline" label="오늘의 기분" />
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

          <InputLabel icon="bookmark-outline" label="오늘 한 일 (제목)" />
          <TextInput 
            style={styles.input} 
            value={title}
            onChangeText={setTitle}
            placeholder="핵심 내용을 적어주세요"
            placeholderTextColor="#94a3b8"
          />

          <InputLabel icon="document-text-outline" label="상세 내용" />
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={content}
            onChangeText={setContent}
            multiline 
            placeholder="오늘 어떤 작업을 하셨나요?"
            placeholderTextColor="#94a3b8"
          />

          <InputLabel icon="bulb-outline" label="배운 것" />
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={learned}
            onChangeText={setLearned}
            multiline 
            placeholder="새롭게 알게 된 사실"
            placeholderTextColor="#94a3b8"
          />

          <InputLabel icon="alert-circle-outline" label="이슈" />
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={issue}
            onChangeText={setIssue}
            multiline 
            placeholder="어떤 문제가 있었나요?"
            placeholderTextColor="#94a3b8"
          />

          <InputLabel icon="checkmark-circle-outline" label="해결 방법" />
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={solution}
            onChangeText={setSolution}
            multiline 
            placeholder="어떻게 해결하셨나요?"
            placeholderTextColor="#94a3b8"
          />

          <InputLabel icon="attach-outline" label="메모" />
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={memo}
            onChangeText={setMemo}
            multiline 
            placeholder="기타 남기고 싶은 말"
            placeholderTextColor="#94a3b8"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  saveText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  labelIcon: {
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  moodItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 4,
    backgroundColor: COLORS.background,
  },
  moodItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  moodLabelSelected: {
    color: COLORS.primary,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
});
