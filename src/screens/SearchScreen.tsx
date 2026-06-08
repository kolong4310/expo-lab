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
      activeOpacity={0.6}
    >
      <View style={styles.resultHeader}>
        <Text style={styles.resultDate}>{item.date.replace(/-/g, ' / ')}</Text>
        {item.mood && <Text style={styles.resultMood}>{MOOD_MAP[item.mood]}</Text>}
      </View>
      <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
      
      {item.daily_summary && (
        <Text style={styles.resultSummary} numberOfLines={1}>"{item.daily_summary}"</Text>
      )}

      {item.tags && (
        <View style={styles.resultTagList}>
          {item.tags.split(',').map(tag => (
            <TouchableOpacity key={tag} onPress={() => setKeyword(tag)} style={styles.tagChip}>
              <Text style={styles.tagText}>#{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />
      
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={DESIGN.colors.textDim} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            value={keyword}
            onChangeText={setKeyword}
            placeholder="기록 및 태그 검색"
            placeholderTextColor={DESIGN.colors.textDim}
            selectionColor={DESIGN.colors.primary}
            autoFocus
          />
          {keyword.length > 0 && (
            <TouchableOpacity onPress={() => setKeyword('')}>
              <Ionicons name="close-circle" size={18} color={DESIGN.colors.textDim} />
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
            <Text style={styles.emptyText}>
              {keyword.length > 0 
                ? "검색 결과가 없습니다." 
                : "키워드를 입력해 기록을 찾아보세요."}
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: DESIGN.borders.pixel,
    borderBottomColor: DESIGN.colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN.colors.bgSecondary,
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: DESIGN.colors.text,
  },
  list: {
    paddingHorizontal: 24,
  },
  resultItem: {
    paddingVertical: 20,
    paddingHorizontal: 14,
    backgroundColor: DESIGN.colors.bgSecondary,
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.purple,
    borderRadius: 12,
    marginBottom: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  resultDate: {
    fontSize: 13,
    fontWeight: '900',
    color: DESIGN.colors.yellow,
    fontFamily: 'monospace',
  },
  resultMood: {
    fontSize: 14,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: DESIGN.colors.text,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  resultSummary: {
    fontSize: 15,
    fontWeight: '900',
    color: DESIGN.colors.primary,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  resultTagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    backgroundColor: DESIGN.colors.surface,
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.mint,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 13,
    color: DESIGN.colors.text,
    fontFamily: 'monospace',
  },
  emptyState: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: DESIGN.colors.textDim,
  },
});
