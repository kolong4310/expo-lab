import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { searchLogs, WorkLog } from '../database/db';
import { DESIGN } from '../theme/design';

const MOOD_MAP: any = {
  best: '🔥',
  good: '✨',
  normal: '☁️',
  hard: '🌊',
};

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<WorkLog[]>([]);

  useEffect(() => {
    if (keyword.trim().length > 0) {
      const searchResults = searchLogs(keyword.trim());
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [keyword]);

  const renderResultItem = ({ item }: { item: WorkLog }) => (
    <TouchableOpacity 
      style={styles.resultItem}
      onPress={() => navigation.navigate('Detail', { log: item })}
      activeOpacity={0.4}
    >
      <View style={styles.resultMeta}>
        <Text style={styles.resultDate}>{item.date.replace(/-/g, ' / ')}</Text>
        <View style={styles.resultDivider} />
        {item.mood && <Text style={styles.resultMood}>{MOOD_MAP[item.mood]}</Text>}
      </View>
      <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
      
      {item.daily_summary && (
        <Text style={styles.resultSummary} numberOfLines={1}>"{item.daily_summary}"</Text>
      )}

      <Text style={styles.resultPreview} numberOfLines={2}>
        {item.content || item.learned || item.issue || '성장의 발자취를 남겨보세요.'}
      </Text>

      {item.tags && (
        <View style={styles.resultTagList}>
          {item.tags.split(',').map(tag => (
            <Text key={tag} style={styles.resultTagText}>#{tag}</Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color={DESIGN.colors.text} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={DESIGN.colors.textDim} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={keyword}
            onChangeText={setKeyword}
            placeholder="Search insights..."
            placeholderTextColor={DESIGN.colors.textMuted}
            autoFocus
          />
          {keyword.length > 0 && (
            <TouchableOpacity onPress={() => setKeyword('')}>
              <Ionicons name="close-circle" size={18} color={DESIGN.colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={results}
        renderItem={renderResultItem}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons 
              name={keyword.length > 0 ? "search-outline" : "finger-print-outline"} 
              size={48} 
              color={DESIGN.colors.textMuted} 
              style={{ marginBottom: 16, opacity: 0.3 }}
            />
            <Text style={styles.emptyText}>
              {keyword.length > 0 
                ? "No matching insights found." 
                : "Enter keywords to search your growth protocol."}
            </Text>
          </View>
        }
      />
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN.colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: DESIGN.colors.text,
    fontWeight: '500',
  },
  list: {
    paddingTop: 10,
    paddingBottom: 40,
  },
  resultItem: {
    paddingVertical: 20,
    paddingHorizontal: 28,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.colors.border,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultDate: {
    fontSize: 10,
    fontWeight: '800',
    color: DESIGN.colors.textDim,
    letterSpacing: 1,
  },
  resultDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: DESIGN.colors.border,
    marginHorizontal: 8,
  },
  resultMood: {
    fontSize: 11,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DESIGN.colors.text,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  resultSummary: {
    fontSize: 14,
    fontWeight: '600',
    color: DESIGN.colors.accent,
    fontStyle: 'italic',
    marginBottom: 8,
    opacity: 0.9,
  },
  resultPreview: {
    fontSize: 13,
    color: DESIGN.colors.textDim,
    lineHeight: 20,
    marginBottom: 10,
  },
  resultTagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  resultTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: DESIGN.colors.primary,
    marginRight: 8,
  },
  emptyState: {
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 13,
    color: DESIGN.colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: 20,
  },
});
