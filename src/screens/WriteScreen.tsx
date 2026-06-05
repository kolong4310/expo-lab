import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { addLog, updateLog, WorkLog } from '../database/db';

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
    <View className="flex-row items-center mt-6 mb-2">
      <Ionicons name={icon} size={16} color="#6366f1" className="mr-1.5" />
      <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-row justify-between items-center px-6 py-4 border-b border-slate-100">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full justify-center items-start"
          >
            <Ionicons name="close" size={26} color="#1e293b" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-slate-900">{editingLog ? '기록 수정' : '기록하기'}</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text className="text-base font-bold text-indigo-600">
              {editingLog ? '완료' : '저장'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          className="px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <InputLabel icon="happy-outline" label="오늘의 기분" />
          <View className="flex-row justify-between mb-2">
            {MOODS.map((item) => (
              <TouchableOpacity
                key={item.value}
                className={`flex-1 items-center py-3 rounded-2xl border mx-1 bg-slate-50 ${
                  mood === item.value ? 'border-indigo-500 bg-white shadow-sm' : 'border-slate-100'
                }`}
                onPress={() => setMood(item.value)}
              >
                <Text className="text-2xl mb-1">{item.emoji}</Text>
                <Text className={`text-xs font-bold ${mood === item.value ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <InputLabel icon="bookmark-outline" label="오늘 한 일 (제목)" />
          <TextInput 
            className="bg-slate-50 rounded-xl p-4 text-base text-slate-900 border border-slate-100" 
            value={title}
            onChangeText={setTitle}
            placeholder="핵심 내용을 적어주세요"
            placeholderTextColor="#94a3b8"
          />

          <InputLabel icon="document-text-outline" label="상세 내용" />
          <TextInput 
            className="bg-slate-50 rounded-xl p-4 text-base text-slate-900 border border-slate-100 h-32" 
            value={content}
            onChangeText={setContent}
            multiline 
            textAlignVertical="top"
            placeholder="오늘 어떤 작업을 하셨나요?"
            placeholderTextColor="#94a3b8"
          />

          <InputLabel icon="bulb-outline" label="배운 것" />
          <TextInput 
            className="bg-slate-50 rounded-xl p-4 text-base text-slate-900 border border-slate-100 h-32" 
            value={learned}
            onChangeText={setLearned}
            multiline 
            textAlignVertical="top"
            placeholder="새롭게 알게 된 사실"
            placeholderTextColor="#94a3b8"
          />

          <InputLabel icon="alert-circle-outline" label="이슈" />
          <TextInput 
            className="bg-slate-50 rounded-xl p-4 text-base text-slate-900 border border-slate-100 h-32" 
            value={issue}
            onChangeText={setIssue}
            multiline 
            textAlignVertical="top"
            placeholder="어떤 문제가 있었나요?"
            placeholderTextColor="#94a3b8"
          />

          <InputLabel icon="checkmark-circle-outline" label="해결 방법" />
          <TextInput 
            className="bg-slate-50 rounded-xl p-4 text-base text-slate-900 border border-slate-100 h-32" 
            value={solution}
            onChangeText={setSolution}
            multiline 
            textAlignVertical="top"
            placeholder="어떻게 해결하셨나요?"
            placeholderTextColor="#94a3b8"
          />

          <InputLabel icon="attach-outline" label="메모" />
          <TextInput 
            className="bg-slate-50 rounded-xl p-4 text-base text-slate-900 border border-slate-100 h-32" 
            value={memo}
            onChangeText={setMemo}
            multiline 
            textAlignVertical="top"
            placeholder="기타 남기고 싶은 말"
            placeholderTextColor="#94a3b8"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
