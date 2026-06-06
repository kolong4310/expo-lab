import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { WorkLog, deleteLog, getDailyGoalsWithCheck } from '../database/db';
import { DESIGN } from '../theme/design';

const MOOD_MAP: any = {
  best: { emoji: '🔥', label: '최고' },
  good: { emoji: '✨', label: '좋음' },
  normal: { emoji: '☁️', label: '보통' },
  hard: { emoji: '🌊', label: '힘듦' },
};

export default function DetailScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { log } = route.params as { log: WorkLog };
  
  const dailyGoals = getDailyGoalsWithCheck(log.date);

  const handleDelete = () => {
    Alert.alert(
      '기록 삭제',
      '이 기록을 영구적으로 삭제하시겠습니까?',
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

  const InsightSection = ({ label, content }: { label: string, content: string }) => {
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
          <Ionicons name="chevron-back" size={24} color={DESIGN.colors.primary} />
          <Text style={styles.backText}>기록</Text>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Write', { log })}
            style={styles.actionButton}
          >
            <Text style={styles.editText}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={20} color={DESIGN.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 60 }}
      >
        <View style={styles.heroArea}>
          <Text style={styles.dateText}>{log.date.replace(/-/g, ' / ')}</Text>
          <Text style={styles.heroTitle}>{log.title}</Text>
          
          {log.daily_summary && (
            <View style={styles.mantraContainer}>
              <Text style={styles.mantraText}>"{log.daily_summary}"</Text>
            </View>
          )}

          {log.mood && MOOD_MAP[log.mood] && (
            <View style={styles.moodBadge}>
              <Text style={styles.moodEmoji}>{MOOD_MAP[log.mood].emoji}</Text>
              <Text style={styles.moodLabel}>{MOOD_MAP[log.mood].label}</Text>
            </View>
          )}

          {log.tags && (
            <View style={styles.tagList}>
              {log.tags.split(',').map(tag => (
                <Text key={tag} style={styles.tagText}>#{tag}</Text>
              ))}
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {dailyGoals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>그날의 목표</Text>
            <View style={styles.goalList}>
              {dailyGoals.map(goal => (
                <View key={goal.goal_id} style={styles.goalRow}>
                  <Ionicons 
                    name={goal.is_done === 1 ? "checkmark-circle" : "ellipse-outline"} 
                    size={20} 
                    color={goal.is_done === 1 ? DESIGN.colors.primary : DESIGN.colors.border} 
                  />
                  <Text style={[styles.goalText, goal.is_done === 1 && styles.goalTextDone]}>
                    {goal.title}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <InsightSection label="과정" content={log.content} />
        <InsightSection label="배운 점" content={log.learned} />
        <InsightSection label="이슈와 해결" content={log.issue} />
        <InsightSection label="메모" content={log.memo} />
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
    borderBottomWidth: 0.5,
    borderBottomColor: DESIGN.colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 17,
    color: DESIGN.colors.primary,
    marginLeft: -4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  editText: {
    fontSize: 17,
    color: DESIGN.colors.primary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  heroArea: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: DESIGN.colors.textDim,
    marginBottom: 8,
  },
  heroTitle: {
    ...DESIGN.typography.largeTitle,
    color: DESIGN.colors.text,
    marginBottom: 16,
  },
  mantraContainer: {
    backgroundColor: DESIGN.colors.bgSecondary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  mantraText: {
    fontSize: 18,
    fontWeight: '600',
    color: DESIGN.colors.primary,
    fontStyle: 'italic',
    lineHeight: 26,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  moodEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  moodLabel: {
    fontSize: 15,
    color: DESIGN.colors.text,
    fontWeight: '500',
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagText: {
    fontSize: 15,
    color: DESIGN.colors.textDim,
    marginRight: 12,
  },
  divider: {
    height: 1,
    backgroundColor: DESIGN.colors.border,
    marginHorizontal: 24,
    marginBottom: 32,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: DESIGN.colors.textDim,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 17,
    color: DESIGN.colors.text,
    lineHeight: 26,
  },
  goalList: {
    marginTop: 8,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalText: {
    marginLeft: 12,
    fontSize: 16,
    color: DESIGN.colors.text,
  },
  goalTextDone: {
    color: DESIGN.colors.textDim,
    textDecorationLine: 'line-through',
  },
});
