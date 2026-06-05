import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAllLogs, WorkLog } from '../database/db';
import { DESIGN } from '../theme/design';

const MOOD_MAP: any = {
  best: '🔥',
  good: '✨',
  normal: '☁️',
  hard: '🌊',
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

  const renderInsight = ({ item, index }: { item: WorkLog, index: number }) => (
    <TouchableOpacity 
      style={styles.insightItem}
      onPress={() => navigation.navigate('Detail', { log: item })}
      activeOpacity={0.4}
    >
      <View style={styles.insightMeta}>
        <Text style={styles.insightDate}>{item.date.split('-').slice(1).join(' / ')}</Text>
        <View style={styles.insightDivider} />
        {item.mood && <Text style={styles.insightMood}>{MOOD_MAP[item.mood]}</Text>}
      </View>

      <Text style={styles.insightTitle}>{item.title}</Text>
      
      <View style={styles.insightContentRow}>
        <View style={[styles.indicator, { backgroundColor: index % 2 === 0 ? DESIGN.colors.primary : DESIGN.colors.accent }]} />
        <Text style={styles.insightPreview} numberOfLines={1}>
          {item.content || 'No content provided for this development insight.'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerGlow}>.</Text>
          <Text style={styles.headerLabel}>INSIGHTS</Text>
        </View>
        <TouchableOpacity 
          style={styles.archiveButton}
          onPress={() => navigation.navigate('Calendar')}
        >
          <Ionicons name="layers-outline" size={20} color={DESIGN.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.heroGreeting}>Hello, Dev.</Text>
        <Text style={styles.heroStat}>{logs.length} Journeys Recorded</Text>
      </View>

      <FlatList
        data={logs}
        renderItem={renderInsight}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌑</Text>
            <Text style={styles.emptyText}>The abyss is empty. Fill it with your growth.</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('Write')}
        activeOpacity={0.8}
      >
        <View style={styles.actionInner}>
          <Ionicons name="add" size={28} color={DESIGN.colors.bg} />
        </View>
      </TouchableOpacity>
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
    paddingHorizontal: 28,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerGlow: {
    fontSize: 24,
    color: DESIGN.colors.secondary,
    fontWeight: '900',
    marginRight: 6,
    marginTop: -10,
  },
  headerLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: DESIGN.colors.text,
    letterSpacing: 3,
  },
  archiveButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    paddingHorizontal: 28,
    paddingTop: 30,
    paddingBottom: 40,
  },
  heroGreeting: {
    fontSize: 48,
    fontWeight: '900',
    color: DESIGN.colors.text,
    letterSpacing: -2,
  },
  heroStat: {
    fontSize: 14,
    fontWeight: '500',
    color: DESIGN.colors.textDim,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  list: {
    paddingHorizontal: 28,
    paddingBottom: 120,
  },
  insightItem: {
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: DESIGN.colors.border,
  },
  insightMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  insightDate: {
    fontSize: 11,
    fontWeight: '800',
    color: DESIGN.colors.textDim,
    letterSpacing: 1.5,
  },
  insightDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: DESIGN.colors.border,
    marginHorizontal: 10,
  },
  insightMood: {
    fontSize: 12,
  },
  insightTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: DESIGN.colors.text,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  insightContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 2,
    height: 14,
    marginRight: 10,
    borderRadius: 1,
  },
  insightPreview: {
    fontSize: 14,
    color: DESIGN.colors.textDim,
    fontWeight: '400',
  },
  emptyState: {
    marginTop: 80,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: DESIGN.colors.textDim,
    textAlign: 'center',
    fontWeight: '500',
  },
  actionButton: {
    position: 'absolute',
    right: 28,
    bottom: 40,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: DESIGN.colors.secondary, // Bright neon accent
    padding: 3,
  },
  actionInner: {
    flex: 1,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DESIGN.colors.text,
  },
});
