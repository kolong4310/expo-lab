import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAllLogs, WorkLog } from '../database/db';

const COLORS = {
  primary: '#4F46E5', // Indigo
  background: '#FFFFFF',
  text: '#000000',
  textSecondary: '#666666',
  border: '#F2F2F2',
  dot: '#E5E5E5',
};

const MOOD_MAP: any = {
  best: '🔥',
  good: '😀',
  normal: '🙂',
  hard: '😓',
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [logs, setLogs] = useState<WorkLog[]>([]);

  useFocusEffect(
    useCallback(() => {
      const data = getAllLogs();
      setLogs(data);
    }, [])
  );

  const renderTimelineItem = ({ item, index }: { item: WorkLog, index: number }) => (
    <TouchableOpacity 
      style={styles.timelineItem}
      onPress={() => navigation.navigate('Detail', { log: item })}
      activeOpacity={0.5}
    >
      {/* Left Timeline Line */}
      <View style={styles.leftLineArea}>
        <View style={[styles.timelineLine, index === 0 && { top: 12 }, index === logs.length - 1 && { height: 12 }]} />
        <View style={styles.timelineDot} />
      </View>

      <View style={styles.contentArea}>
        <View style={styles.dateMoodRow}>
          <Text style={styles.itemDate}>{item.date.replace(/-/g, '. ')}</Text>
          {item.mood && <Text style={styles.moodEmoji}>{MOOD_MAP[item.mood]}</Text>}
        </View>
        
        <Text style={styles.itemTitle}>{item.title}</Text>
        
        <Text style={styles.itemSummary} numberOfLines={2}>
          {item.content || '성장의 기록이 비어있습니다.'}
        </Text>

        <View style={styles.footerRow}>
          <Text style={styles.tagText}>#Log_{logs.length - index}</Text>
          <Ionicons name="chevron-forward" size={14} color={COLORS.dot} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Timeline</Text>
          <Text style={styles.headerSubtitle}>성장의 궤적</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Calendar')}
          >
            <Ionicons name="archive-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={logs}
        renderItem={renderTimelineItem}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>시작은 작게, 기록은 꾸준히.</Text>
            <Text style={styles.emptySubText}>첫 번째 발자취를 남겨보세요.</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('Write')}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={32} color={COLORS.background} />
      </TouchableOpacity>
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
    alignItems: 'flex-end',
    paddingHorizontal: 30,
    paddingTop: 30,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -1.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '400',
    marginTop: -2,
    letterSpacing: 0.5,
  },
  headerActions: {
    marginBottom: 8,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 0,
    paddingBottom: 120,
  },
  timelineItem: {
    flexDirection: 'row',
    paddingRight: 30,
  },
  leftLineArea: {
    width: 60,
    alignItems: 'center',
  },
  timelineLine: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: COLORS.border,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.dot,
    marginTop: 12,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  contentArea: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dateMoodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemDate: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 1,
  },
  moodEmoji: {
    fontSize: 12,
    marginLeft: 6,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  itemSummary: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    fontWeight: '400',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  emptyContainer: {
    marginTop: 150,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 40,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.text, // Pure Black
    justifyContent: 'center',
    alignItems: 'center',
  },
});
