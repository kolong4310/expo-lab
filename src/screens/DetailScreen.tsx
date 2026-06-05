import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { WorkLog, deleteLog } from '../database/db';

const MOOD_MAP: any = {
  best: { emoji: '🔥', label: '최고' },
  good: { emoji: '😀', label: '좋음' },
  normal: { emoji: '🙂', label: '보통' },
  hard: { emoji: '😓', label: '힘듦' },
};

export default function DetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { log } = route.params as { log: WorkLog };

  const handleDelete = () => {
    Alert.alert(
      '삭제 확인',
      '정말로 이 기록을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: () => {
            if (log.id) {
              deleteLog(log.id);
              navigation.goBack();
            }
          }
        }
      ]
    );
  };

  const InfoSection = ({ icon, label, content }: { icon: any, label: string, content: string }) => {
    if (!content || content.trim() === '') return null;
    return (
      <View className="px-6 py-4">
        <View className="flex-row items-center mb-3">
          <Ionicons name={icon} size={18} color="#6366f1" className="mr-2" />
          <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</Text>
        </View>
        <View className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
          <Text className="text-base text-slate-800 leading-7">{content}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <View className="flex-row justify-between items-center px-6 py-4 border-b border-slate-100">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full justify-center items-start"
        >
          <Ionicons name="arrow-back" size={26} color="#1e293b" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-900">상세 보기</Text>
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.navigate('Write', { log })}
            className="p-2 ml-1"
          >
            <Ionicons name="create-outline" size={24} color="#6366f1" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleDelete}
            className="p-2 ml-1"
          >
            <Ionicons name="trash-outline" size={24} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="p-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm font-medium text-slate-400">{log.date}</Text>
            {log.mood && MOOD_MAP[log.mood] && (
              <View className="flex-row items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <Text className="text-sm mr-1.5">{MOOD_MAP[log.mood].emoji}</Text>
                <Text className="text-xs font-bold text-slate-500">{MOOD_MAP[log.mood].label}</Text>
              </View>
            )}
          </View>
          <Text className="text-2xl font-black text-slate-900 leading-tight">{log.title}</Text>
        </View>

        <View className="h-2 bg-slate-50 my-2" />

        <InfoSection icon="document-text-outline" label="상세 내용" content={log.content} />
        <InfoSection icon="bulb-outline" label="배운 것" content={log.learned} />
        <InfoSection icon="alert-circle-outline" label="이슈" content={log.issue} />
        <InfoSection icon="checkmark-circle-outline" label="해결 방법" content={log.solution} />
        <InfoSection icon="attach-outline" label="메모" content={log.memo} />
      </ScrollView>
    </SafeAreaView>
  );
}
