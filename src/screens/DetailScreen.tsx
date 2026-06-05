import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { WorkLog, deleteLog } from '../database/db';

const COLORS = {
  primary: '#6366f1',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#0f172a',
  textSecondary: '#64748b',
  border: '#f1f5f9',
  error: '#ef4444',
};

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
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name={icon} size={18} color={COLORS.primary} style={styles.sectionIcon} />
          <Text style={styles.sectionLabel}>{label}</Text>
        </View>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionText}>{content}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={26} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>상세 보기</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Write', { log })}
            style={styles.actionButton}
          >
            <Ionicons name="create-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleDelete}
            style={styles.actionButton}
          >
            <Ionicons name="trash-outline" size={24} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.titleContainer}>
          <View style={styles.dateMoodRow}>
            <Text style={styles.dateText}>{log.date}</Text>
            {log.mood && MOOD_MAP[log.mood] && (
              <View style={styles.moodBadge}>
                <Text style={styles.moodEmoji}>{MOOD_MAP[log.mood].emoji}</Text>
                <Text style={styles.moodLabel}>{MOOD_MAP[log.mood].label}</Text>
              </View>
            )}
          </View>
          <Text style={styles.titleText}>{log.title}</Text>
        </View>

        <View style={styles.divider} />

        <InfoSection icon="document-text-outline" label="상세 내용" content={log.content} />
        <InfoSection icon="bulb-outline" label="배운 것" content={log.learned} />
        <InfoSection icon="alert-circle-outline" label="이슈" content={log.issue} />
        <InfoSection icon="checkmark-circle-outline" label="해결 방법" content={log.solution} />
        <InfoSection icon="attach-outline" label="메모" content={log.memo} />
      </ScrollView>
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
  backButton: {
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    padding: 24,
  },
  dateMoodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  moodEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  moodLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  titleText: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
    lineHeight: 32,
  },
  divider: {
    height: 8,
    backgroundColor: COLORS.background,
    marginVertical: 8,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionContent: {
    backgroundColor: COLORS.background,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 26,
  },
});
