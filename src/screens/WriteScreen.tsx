import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function WriteScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>기록하기</Text>
        <TouchableOpacity onPress={() => alert('저장 기능 구현 중!')}>
          <Text style={styles.saveText}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>오늘 한 일</Text>
        <TextInput style={styles.input} placeholder="핵심 내용을 적어주세요" />

        <Text style={styles.label}>배운 것</Text>
        <TextInput style={[styles.input, styles.textArea]} multiline placeholder="새롭게 알게 된 사실" />

        <Text style={styles.label}>이슈 / 해결 방법</Text>
        <TextInput style={[styles.input, styles.textArea]} multiline placeholder="어려웠던 점과 해결한 방법" />

        <Text style={styles.label}>메모</Text>
        <TextInput style={[styles.input, styles.textArea]} multiline placeholder="기타 남기고 싶은 말" />
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
