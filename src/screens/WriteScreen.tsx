import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { addLog } from '../database/db';

export default function WriteScreen() {
  const navigation = useNavigation();

  // 1. 입력 데이터를 관리할 상태(State) 선언
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [learned, setLearned] = useState('');
  const [issue, setIssue] = useState('');
  const [solution, setSolution] = useState('');
  const [memo, setMemo] = useState('');

  // 2. 저장 함수 구현
  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('알림', '오늘 한 일의 제목을 입력해주세요.');
      return;
    }

    try {
      const newLog = {
        title,
        content,
        learned,
        issue,
        solution,
        memo,
        date: new Date().toISOString().split('T')[0], // 오늘 날짜 (YYYY-MM-DD)
      };

      addLog(newLog); // DB에 저장
      Alert.alert('성공', '기록이 저장되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '저장 중 문제가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>기록하기</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>오늘 한 일 (제목)</Text>
        <TextInput 
          style={styles.input} 
          value={title}
          onChangeText={setTitle}
          placeholder="핵심 내용을 적어주세요" 
        />

        <Text style={styles.label}>상세 내용</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          value={content}
          onChangeText={setContent}
          multiline 
          placeholder="오늘 어떤 작업을 하셨나요?" 
        />

        <Text style={styles.label}>배운 것</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          value={learned}
          onChangeText={setLearned}
          multiline 
          placeholder="새롭게 알게 된 사실" 
        />

        <Text style={styles.label}>이슈 / 해결 방법</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          value={issue}
          onChangeText={setIssue}
          multiline 
          placeholder="어려웠던 점과 해결한 방법" 
        />

        <Text style={styles.label}>메모</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          value={memo}
          onChangeText={setMemo}
          multiline 
          placeholder="기타 남기고 싶은 말" 
        />
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});
