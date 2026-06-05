import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { WorkLog, deleteLog } from '../database/db';

const COLORS = {
  primary: '#4F46E5',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  error: '#EF4444',
  indigoSubtle: '#EEF2FF',
};

const MOOD_MAP: any = {
  best: { emoji: '🔥', label: '최고의 하루' },
  good: { emoji: '😀', label: '좋은 기분' },
  normal: { emoji: '🙂', label: '평범한 보통' },
  hard: { emoji: '😓', label: '조금 힘듦' },
};

export default function DetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { log } = route.params as { log: WorkLog };

  const handleDelete = () => {
    Alert.alert(
      '기록 삭제',
      '정말로 이 소중한 기록을 삭제하시겠습니까?',
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

  const InfoCard = ({ icon, label, content }: { icon: any, label: string, content: string }) => {
    if (!content || content.trim() === '') return null;
    return (
      <View style={styles.infoCard}>
        <View style={styles.cardHeader}>
          <Ionicons name={icon} size={18} color={COLORS.primary} style={styles.cardIcon} />
          <Text style={styles.cardLabel}>{label}</Text>
        </View>
        <Text style={styles.cardText}>{content}</Text>
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
          <Ionicons name="chevron-back" size={28} color={COLORS.text} />
        </TouchableOpacity>
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
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View style={styles.titleSection}>
          <View style={styles.metaRow}>
            <Text style={styles.dateText}>{log.date.replace(/-/g, '. ')}</Text>
            {log.mood && MOOD_MAP[log.mood] && (
              <View style={styles.moodBadge}>
                <Text style={styles.moodEmoji}>{MOOD_MAP[log.mood].emoji}</Text>
                <Text style={styles.moodLabel}>{MOOD_MAP[log.mood].label}</Text>
              </View>
            )}
          </View>
          <Text style={styles.mainTitle}>{log.title}</Text>
        </View>

        <View style={styles.divider} />

        <InfoCard icon="document-text-outline" label="오늘의 기록" content={log.content} />
        <InfoCard icon="bulb-outline" label="배운 점" content={log.learned} />
        <InfoCard icon="alert-circle-outline" label="이슈" content={log.issue} />
        <InfoCard icon="checkmark-circle-outline" label="해결 방법" content={log.solution} />
        <InfoCard icon="attach-outline" label="메모" content={log.memo} />
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
    paddingVertical: 12,
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
  titleSection: {
    paddingHorizontal: 28,
    paddingTop: 10,
    paddingBottom: 28,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  moodEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  moodLabel: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '700',
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 28,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardIcon: {
    marginRight: 8,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 28,
    fontWeight: '400',
  },
});
