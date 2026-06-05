import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { WorkLog, deleteLog } from '../database/db';

const COLORS = {
  primary: '#4F46E5',
  background: '#FFFFFF',
  text: '#000000',
  textSecondary: '#666666',
  border: '#F2F2F2',
  error: '#FF3B30',
};

const MOOD_MAP: any = {
  best: '🔥 최고',
  good: '😀 좋음',
  normal: '🙂 보통',
  hard: '😓 힘듦',
};

export default function DetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { log } = route.params as { log: WorkLog };

  const handleDelete = () => {
    Alert.alert(
      '기록 삭제',
      '이 성장 기록을 지우시겠습니까?',
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

  const ContentSection = ({ label, content }: { label: string, content: string }) => {
    if (!content || content.trim() === '') return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{label}</Text>
        <Text style={styles.sectionText}>{content}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Write', { log })}
            style={styles.actionButton}
          >
            <Ionicons name="create-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={22} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View style={styles.titleArea}>
          <View style={styles.metaRow}>
            <Text style={styles.dateText}>{log.date.replace(/-/g, '. ')}</Text>
            {log.mood && MOOD_MAP[log.mood] && (
              <Text style={styles.moodText}>{MOOD_MAP[log.mood]}</Text>
            )}
          </View>
          <Text style={styles.mainTitle}>{log.title}</Text>
        </View>

        <View style={styles.divider} />

        <ContentSection label="Today's Log" content={log.content} />
        <ContentSection label="Learned" content={log.learned} />
        <ContentSection label="Issue" content={log.issue} />
        <ContentSection label="Solution" content={log.solution} />
        <ContentSection label="Memo" content={log.memo} />
      </ScrollView>
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
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  titleArea: {
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 30,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  moodText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginLeft: 12,
    backgroundColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 40,
    letterSpacing: -1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 30,
    marginBottom: 30,
  },
  section: {
    paddingHorizontal: 30,
    marginBottom: 40,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 17,
    color: COLORS.text,
    lineHeight: 28,
    fontWeight: '400',
  },
});
