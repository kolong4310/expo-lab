import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { searchLogs, WorkLog } from '../database/db';
import { DESIGN } from '../theme/design';
import RetroCard from '../components/RetroCard';
import RetroInput from '../components/RetroInput';
import PixelSectionTitle from '../components/PixelSectionTitle';

const QUICK_TAGS = ['ReactNative', 'SQLite', 'UI', '공부', '운동', '개발'];

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<WorkLog[]>([]);

  useEffect(() => {
    if (keyword.trim().length > 0) {
      setResults(searchLogs(keyword.trim()));
    } else {
      setResults([]);
    }
  }, [keyword]);

  const renderResultItem = ({ item }: { item: WorkLog }) => (
    <TouchableOpacity style={styles.resultItem} onPress={() => navigation.navigate('Detail', { log: item })}>
      <Text style={styles.resultDate}>{item.date.replace(/-/g, '.')}</Text>
      <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
      {item.daily_summary && <Text style={styles.resultSummary} numberOfLines={2}>{item.daily_summary}</Text>}
      <Text style={styles.openMark}>{'>'}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />

      <FlatList
        data={results}
        renderItem={renderResultItem}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={styles.screenTitle}>SEARCH</Text>
            <Text style={styles.screenSub}>성장 기록 탐색</Text>

            <RetroCard accent="purple" style={styles.searchCard}>
              <View style={styles.searchRow}>
                <Text style={styles.searchIcon}>⌕</Text>
                <RetroInput
                  style={styles.searchInput}
                  value={keyword}
                  onChangeText={setKeyword}
                  placeholder="검색어를 입력해 성장 기록을 찾아보세요."
                  autoFocus
                />
                {keyword.length > 0 && (
                  <TouchableOpacity onPress={() => setKeyword('')}>
                    <Text style={styles.clearText}>X</Text>
                  </TouchableOpacity>
                )}
              </View>
            </RetroCard>

            <PixelSectionTitle>추천 태그</PixelSectionTitle>
            <View style={styles.tagGrid}>
              {QUICK_TAGS.map(tag => (
                <TouchableOpacity key={tag} style={styles.tagChip} onPress={() => setKeyword(tag)}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <PixelSectionTitle>검색 결과</PixelSectionTitle>
            {keyword.length === 0 && (
              <RetroCard accent="cyan" style={styles.emptyCard}>
                <Text style={styles.emptyText}>검색어를 입력해 성장 기록을 찾아보세요.</Text>
              </RetroCard>
            )}
            {keyword.length > 0 && results.length === 0 && (
              <RetroCard accent="pink" style={styles.emptyCard}>
                <Text style={styles.emptyText}>해당하는 성장 기록이 없습니다.</Text>
              </RetroCard>
            )}
          </>
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
  list: {
    paddingHorizontal: DESIGN.spacing.padding,
    paddingTop: 22,
  },
  screenTitle: {
    ...DESIGN.typography.largeTitle,
    color: DESIGN.colors.purple,
  },
  screenSub: {
    fontFamily: 'monospace',
    color: DESIGN.colors.textDim,
    fontWeight: '900',
    marginTop: 4,
    marginBottom: 18,
  },
  searchCard: {
    padding: 14,
    marginBottom: 24,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    color: DESIGN.colors.text,
    fontFamily: 'monospace',
    fontWeight: '900',
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
  },
  clearText: {
    color: DESIGN.colors.error,
    fontFamily: 'monospace',
    fontWeight: '900',
    marginLeft: 10,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  tagChip: {
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.purple,
    backgroundColor: DESIGN.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontFamily: 'monospace',
    color: DESIGN.colors.text,
    fontWeight: '900',
    fontSize: 13,
  },
  resultItem: {
    backgroundColor: DESIGN.colors.surface,
    borderWidth: DESIGN.borders.heavy,
    borderColor: DESIGN.colors.primaryLight,
    borderRightColor: DESIGN.colors.primary,
    borderBottomColor: DESIGN.colors.yellow,
    padding: 14,
    marginBottom: 12,
  },
  resultDate: {
    fontFamily: 'monospace',
    color: DESIGN.colors.purple,
    fontWeight: '900',
    marginBottom: 4,
  },
  resultTitle: {
    color: DESIGN.colors.text,
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 6,
  },
  resultSummary: {
    color: DESIGN.colors.textDim,
    lineHeight: 20,
  },
  openMark: {
    position: 'absolute',
    right: 12,
    top: 16,
    color: DESIGN.colors.primary,
    fontFamily: 'monospace',
    fontWeight: '900',
  },
  emptyCard: {
    padding: 20,
  },
  emptyText: {
    color: DESIGN.colors.textDim,
    lineHeight: 21,
  },
});
