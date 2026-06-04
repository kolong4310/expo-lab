import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);
  const [bgColor, setBgColor] = useState('#fff');

  const handlePress = () => {
    setCount(count + 1);
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    setBgColor(randomColor);
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={styles.title}>🚀 자동 배포 테스트 중!</Text>
      <Text style={styles.subtitle}>이 화면은 GitHub에서 자동으로 업데이트되었습니다.</Text>
      
      <View style={styles.card}>
        <Text style={styles.countText}>클릭 횟수: {count}</Text>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>클릭해서 색상 변경!</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        onPress={() => Alert.alert('성공!', '앱이 정상적으로 작동합니다.')}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: '#007AFF' }}>여기를 눌러보세요</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  countText: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
