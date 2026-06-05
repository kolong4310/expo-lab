import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAllLogs, WorkLog } from '../database/db';

const COLORS = {
  primary: '#6366f1',
  background: '#f8fafc',
  surface: '#ffffff',
  text: '#0f172a',
  textSecondary: '#64748b',
  border: '#f1f5f9',
  white: '#ffffff',
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

  const renderItem = ({ item }: { item: WorkLog }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Detail', { log: item })}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.cardDate}>{item.date}</Text>
        </View>
        <Text style={styles.cardPreview} numberOfLines={2}>
          {item.content || '설명이 없습니다.'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>반가워요! 👋</Text>
          <Text style={styles.headerTitle}>오늘 뭐 했지?</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Calendar')}
          >
            <Ionicons name="calendar-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => alert('검색 기능 준비 중!')}
          >
            <Ionicons name="search" size={22} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={logs}
        renderItem={renderItem}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="document-text-outline" size={32} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyText}>아직 작성된 기록이 없어요.</Text>
            <Text style={styles.emptySubText}>오늘의 소중한 기록을 남겨보세요! ✨</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('Write')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={36} color={COLORS.white} />
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
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  list: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardContent: {
    flex: 1,
    marginRight: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  cardDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  cardPreview: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});
