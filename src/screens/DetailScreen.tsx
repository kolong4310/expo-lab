import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { WorkLog, deleteLog, getTodosByDate, Todo } from '../database/db';
import { DESIGN } from '../theme/design';

const MOOD_MAP: any = {
  best: { emoji: '🔥', label: 'OPTIMAL' },
  good: { emoji: '✨', label: 'BRIGHT' },
  normal: { emoji: '☁️', label: 'NEUTRAL' },
  hard: { emoji: '🌊', label: 'WAVY' },
};

export default function DetailScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { log } = route.params as { log: WorkLog };
  
  // Fetch todos for this specific date
  const dayTodos = getTodosByDate(log.date);

  const handleDelete = () => {
    Alert.alert(
      'Purge Log',
      'This entry will be lost to the void. Continue?',
      [
        { text: 'ABORT', style: 'cancel' },
        { 
          text: 'PURGE', 
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
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color={DESIGN.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Write', { log })}
            style={styles.actionButton}
          >
            <Ionicons name="pencil-outline" size={20} color={DESIGN.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 60 }}
      >
        <View style={styles.heroArea}>
          <View style={styles.metaHeader}>
            <Text style={styles.dateText}>{log.date.replace(/-/g, ' / ')}</Text>
            {log.mood && MOOD_MAP[log.mood] && (
              <View style={styles.moodBadge}>
                <Text style={styles.moodEmoji}>{MOOD_MAP[log.mood].emoji}</Text>
                <Text style={styles.moodLabel}>{MOOD_MAP[log.mood].label}</Text>
              </View>
            )}
          </View>
          <Text style={styles.heroTitle}>{log.title}</Text>
          
          {log.daily_summary && (
            <View style={styles.summaryQuoteContainer}>
              <Ionicons name="quote" size={20} color={DESIGN.colors.accent} style={{ opacity: 0.3, marginBottom: 10 }} />
              <Text style={styles.summaryQuoteText}>{log.daily_summary}</Text>
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

        <View style={styles.dividerArea}>
          <View style={styles.line} />
        </View>

        {/* Action History (Todos) Section */}
        {dayTodos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>MISSION HISTORY</Text>
            <View style={styles.todoList}>
              {dayTodos.map(todo => (
                <View key={todo.id} style={styles.todoRow}>
                  <Ionicons 
                    name={todo.is_completed === 1 ? "checkmark-circle" : "ellipse-outline"} 
                    size={18} 
                    color={todo.is_completed === 1 ? DESIGN.colors.secondary : DESIGN.colors.textMuted} 
                    style={styles.todoIcon}
                  />
                  <Text style={[styles.todoText, todo.is_completed === 1 && styles.todoTextCompleted]}>
                    {todo.task}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <InsightSection label="FLOW" content={log.content} />
        <InsightSection label="INTEL" content={log.learned} />
        <InsightSection label="BLOCK" content={log.issue} />
        <InsightSection label="SOLVE" content={log.solution} />
        <InsightSection label="NOTE" content={log.memo} />
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
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  heroArea: {
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 40,
  },
  metaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '800',
    color: DESIGN.colors.textDim,
    letterSpacing: 2,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
  },
  moodEmoji: {
    fontSize: 12,
    marginRight: 6,
  },
  moodLabel: {
    fontSize: 9,
    color: DESIGN.colors.text,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: DESIGN.colors.text,
    lineHeight: 44,
    letterSpacing: -1.5,
    marginBottom: 16,
  },
  summaryQuoteContainer: {
    marginTop: 8,
    paddingLeft: 4,
  },
  summaryQuoteText: {
    fontSize: 18,
    fontWeight: '600',
    color: DESIGN.colors.accent,
    fontStyle: 'italic',
    lineHeight: 28,
    opacity: 0.9,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '800',
    color: DESIGN.colors.primary,
    marginRight: 12,
    marginBottom: 4,
  },
  dividerArea: {
    paddingHorizontal: 28,
    marginBottom: 40,
  },
  line: {
    height: 1,
    backgroundColor: DESIGN.colors.border,
    width: 40,
  },
  section: {
    paddingHorizontal: 28,
    marginBottom: 48,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: DESIGN.colors.secondary,
    letterSpacing: 2,
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 18,
    color: DESIGN.colors.text,
    lineHeight: 30,
    fontWeight: '400',
    opacity: 0.9,
  },
  todoList: {
    backgroundColor: DESIGN.colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
  },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  todoIcon: {
    marginRight: 10,
  },
  todoText: {
    fontSize: 15,
    color: DESIGN.colors.text,
    fontWeight: '500',
  },
  todoTextCompleted: {
    color: DESIGN.colors.textMuted,
    textDecorationLine: 'line-through',
  },
});
