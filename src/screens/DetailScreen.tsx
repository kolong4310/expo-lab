import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { WorkLog, deleteLog } from '../database/db';
import { Colors, Spacing, Typography } from '../theme/theme';

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
          <Ionicons name={icon} size={18} color={Colors.primary} style={styles.sectionIcon} />
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
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>상세 보기</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Write', { log })}
            style={styles.actionButton}
          >
            <Ionicons name="create-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleDelete}
            style={styles.actionButton}
          >
            <Ionicons name="trash-outline" size={24} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Spacing.xl }}
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

        <InfoSection icon="document-text" label="상세 내용" content={log.content} />
        <InfoSection icon="bulb" label="배운 것" content={log.learned} />
        <InfoSection icon="alert-circle" label="이슈" content={log.issue} />
        <InfoSection icon="checkmark-circle" label="해결 방법" content={log.solution} />
        <InfoSection icon="attach" label="메모" content={log.memo} />
      </ScrollView>
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
    color: Colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    padding: Spacing.lg,
  },
  dateMoodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  dateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  moodEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  moodLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  titleText: {
    ...Typography.h1,
    color: Colors.text,
  },
  divider: {
    height: 8,
    backgroundColor: Colors.background,
    marginVertical: Spacing.sm,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionIcon: {
    marginRight: Spacing.xs,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionText: {
    ...Typography.body,
    lineHeight: 24,
  },
});

