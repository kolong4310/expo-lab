import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { addLog } from '../database/db';
import { Colors, Spacing, Typography } from '../theme/theme';

export default function WriteScreen() {
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [learned, setLearned] = useState('');
  const [issue, setIssue] = useState('');
  const [solution, setSolution] = useState('');
  const [memo, setMemo] = useState('');

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
        date: new Date().toISOString().split('T')[0],
      };

      addLog(newLog);
      Alert.alert('성공', '기록이 저장되었습니다.', [
        { text: '확인', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('오류', '저장 중 문제가 발생했습니다.');
    }
  };

  const InputLabel = ({ icon, label }: { icon: any, label: string }) => (
    <View style={styles.labelContainer}>
      <Ionicons name={icon} size={16} color={Colors.primary} style={styles.labelIcon} />
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
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>기록하기</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>저장</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Spacing.xl }}
        >
          <InputLabel icon="bookmark" label="오늘 한 일 (제목)" />
          <TextInput 
            style={styles.input} 
            value={title}
            onChangeText={setTitle}
            placeholder="핵심 내용을 적어주세요"
            placeholderTextColor={Colors.textSecondary}
          />

          <InputLabel icon="document-text" label="상세 내용" />
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={content}
            onChangeText={setContent}
            multiline 
            placeholder="오늘 어떤 작업을 하셨나요?"
            placeholderTextColor={Colors.textSecondary}
          />

          <InputLabel icon="bulb" label="배운 것" />
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={learned}
            onChangeText={setLearned}
            multiline 
            placeholder="새롭게 알게 된 사실"
            placeholderTextColor={Colors.textSecondary}
          />

          <InputLabel icon="alert-circle" label="이슈" />
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={issue}
            onChangeText={setIssue}
            multiline 
            placeholder="어떤 문제가 있었나요?"
            placeholderTextColor={Colors.textSecondary}
          />

          <InputLabel icon="checkmark-circle" label="해결 방법" />
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={solution}
            onChangeText={setSolution}
            multiline 
            placeholder="어떻게 해결하셨나요?"
            placeholderTextColor={Colors.textSecondary}
          />

          <InputLabel icon="attach" label="메모" />
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={memo}
            onChangeText={setMemo}
            multiline 
            placeholder="기타 남기고 싶은 말"
            placeholderTextColor={Colors.textSecondary}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
    color: Colors.text,
  },
  saveText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  labelIcon: {
    marginRight: Spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: Spacing.md,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
});
