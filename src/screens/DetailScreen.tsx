import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { WorkLog, deleteLog, getDailyGoalsWithCheck } from '../database/db';
import { DESIGN } from '../theme/design';
import RetroCard from '../components/RetroCard';

const MOOD_MAP: any = {
  best: 'BEST',
  good: 'GOOD',
  normal: 'NORM',
  hard: 'HARD',
};

export default function DetailScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { log } = route.params as { log: WorkLog };
  const dailyGoals = getDailyGoalsWithCheck(log.date);

  const handleDelete = () => {
    Alert.alert('기록 삭제', '이 기록을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          if (log.id) {
            deleteLog(log.id);
            navigation.goBack();
          }
        },
      },
    ]);
  };

  const InsightSection = ({ label, content }: { label: string, content: string }) => {
    if (!content || content.trim() === '') return null;
    return (
      <RetroCard accent="cyan" style={styles.section}>
        <Text style={styles.sectionLabel}>{label}</Text>
        <Text style={styles.sectionText}>{content}</Text>
      </RetroCard>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>BACK</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>LOG DETAIL</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Write', { log })}>
            <Text style={styles.actionText}>EDIT</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Text style={styles.deleteText}>DEL</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 60 }}
      >
        <RetroCard accent="pink" style={styles.heroCard}>
          <Text style={styles.dateText}>{log.date.replace(/-/g, '.')}</Text>
          <Text style={styles.heroTitle}>{log.title}</Text>
          {log.daily_summary && <Text style={styles.mantraText}>"{log.daily_summary}"</Text>}
          <View style={styles.metaRow}>
            {log.mood && <Text style={styles.metaBadge}>{MOOD_MAP[log.mood]}</Text>}
            {log.tags?.split(',').map(tag => (
              <Text key={tag} style={styles.tagText}>#{tag}</Text>
            ))}
          </View>
        </RetroCard>

        {dailyGoals.length > 0 && (
          <RetroCard accent="green" style={styles.section}>
            <Text style={styles.sectionLabel}>DAY MISSIONS</Text>
            {dailyGoals.map(goal => (
              <Text key={goal.goal_id} style={[styles.goalText, goal.is_done === 1 && styles.goalTextDone]}>
                {goal.is_done === 1 ? '■' : '□'} {goal.title}
              </Text>
            ))}
          </RetroCard>
        )}

        <InsightSection label="PROGRESS" content={log.content} />
        <InsightSection label="EXP GAINED" content={log.learned} />
        <InsightSection label="OBSTACLE / SOLVE" content={log.issue} />
        <InsightSection label="MEMO" content={log.memo} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DESIGN.colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: DESIGN.borders.heavy,
    borderBottomColor: DESIGN.colors.border,
  },
  headerButton: {
    width: 70,
  },
  headerButtonText: {
    fontFamily: 'monospace',
    color: DESIGN.colors.primaryLight,
    fontWeight: '900',
  },
  headerTitle: {
    fontFamily: 'monospace',
    color: DESIGN.colors.yellow,
    fontWeight: '900',
    fontSize: 17,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 14,
  },
  actionText: {
    fontFamily: 'monospace',
    color: DESIGN.colors.mint,
    fontWeight: '900',
  },
  deleteText: {
    fontFamily: 'monospace',
    color: DESIGN.colors.error,
    fontWeight: '900',
  },
  content: {
    flex: 1,
    backgroundColor: DESIGN.colors.bg,
    paddingHorizontal: 24,
  },
  heroCard: {
    padding: 18,
    marginTop: 24,
    marginBottom: 22,
  },
  dateText: {
    fontFamily: 'monospace',
    color: DESIGN.colors.yellow,
    fontWeight: '900',
    marginBottom: 8,
  },
  heroTitle: {
    ...DESIGN.typography.largeTitle,
    color: DESIGN.colors.text,
    marginBottom: 12,
  },
  mantraText: {
    color: DESIGN.colors.primary,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 26,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaBadge: {
    fontFamily: 'monospace',
    color: DESIGN.colors.mint,
    fontWeight: '900',
    marginRight: 12,
  },
  tagText: {
    fontFamily: 'monospace',
    color: DESIGN.colors.textDim,
    fontWeight: '900',
    marginRight: 10,
  },
  section: {
    padding: 16,
    marginBottom: 18,
  },
  sectionLabel: {
    fontFamily: 'monospace',
    color: DESIGN.colors.primaryLight,
    fontWeight: '900',
    marginBottom: 10,
  },
  sectionText: {
    color: DESIGN.colors.text,
    fontSize: 16,
    lineHeight: 25,
  },
  goalText: {
    color: DESIGN.colors.text,
    fontSize: 16,
    marginBottom: 8,
  },
  goalTextDone: {
    color: DESIGN.colors.mint,
  },
});
