import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getAllGoals, addGoal, updateGoal, Goal } from '../database/db';
import { DESIGN } from '../theme/design';
import RetroCard from '../components/RetroCard';
import RetroButton from '../components/RetroButton';
import RetroInput from '../components/RetroInput';
import PixelSectionTitle from '../components/PixelSectionTitle';

const CATEGORIES = ['건강', '공부', '일', '생활', '성장', '기타'];

export default function GoalManageScreen() {
  const insets = useSafeAreaInsets();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('성장');

  useFocusEffect(
    useCallback(() => {
      loadGoals();
    }, [])
  );

  const loadGoals = () => {
    setGoals(getAllGoals());
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addGoal(newTitle.trim(), selectedCategory);
    setNewTitle('');
    loadGoals();
  };

  const handleToggleActive = (item: Goal) => {
    updateGoal(item.id!, item.title, item.category, item.is_active === 1 ? 0 : 1);
    loadGoals();
  };

  const renderGoal = ({ item }: { item: Goal }) => (
    <View style={styles.goalRow}>
      <View style={styles.goalInfo}>
        <Text style={styles.goalCategory}>{item.category}</Text>
        <Text style={[styles.goalTitle, item.is_active === 0 && styles.disabledText]}>{item.title}</Text>
      </View>
      <TouchableOpacity onPress={() => handleToggleActive(item)} style={[styles.switchBox, item.is_active === 1 && styles.switchOn]}>
        <Text style={styles.switchText}>{item.is_active === 1 ? 'ON' : 'OFF'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />
      <FlatList
        data={goals}
        renderItem={renderGoal}
        keyExtractor={item => item.id?.toString() || ''}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 30 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <Text style={styles.screenTitle}>ROUTINE SETUP</Text>
            <Text style={styles.screenSub}>반복 미션 관리</Text>

            <RetroCard accent="pink" style={styles.addPanel}>
              <PixelSectionTitle>새 반복 미션</PixelSectionTitle>
              <RetroInput
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="매일 반복할 목표 입력"
                returnKeyType="done"
                onSubmitEditing={handleAdd}
                style={styles.input}
              />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catChip, selectedCategory === cat && styles.catChipSelected]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text style={[styles.catText, selectedCategory === cat && styles.catTextSelected]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <RetroButton label="매일 반복할 미션 추가" onPress={handleAdd} />
            </RetroCard>

            <PixelSectionTitle>반복 미션 목록</PixelSectionTitle>
          </>
        }
        ListEmptyComponent={
          <RetroCard accent="purple" style={styles.emptyCard}>
            <Text style={styles.emptyText}>등록된 반복 미션이 없습니다.</Text>
          </RetroCard>
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
    color: DESIGN.colors.mint,
  },
  screenSub: {
    fontFamily: 'monospace',
    color: DESIGN.colors.textDim,
    fontWeight: '900',
    marginTop: 4,
    marginBottom: 18,
  },
  addPanel: {
    padding: 16,
    marginBottom: 22,
  },
  input: {
    marginBottom: 14,
  },
  categoryRow: {
    marginBottom: 16,
  },
  catChip: {
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.cyan,
    backgroundColor: DESIGN.colors.bg,
    paddingHorizontal: 13,
    paddingVertical: 8,
    marginRight: 8,
  },
  catChipSelected: {
    borderColor: DESIGN.colors.yellow,
    backgroundColor: DESIGN.colors.primary,
  },
  catText: {
    fontFamily: 'monospace',
    color: DESIGN.colors.text,
    fontWeight: '900',
    fontSize: 13,
  },
  catTextSelected: {
    color: DESIGN.colors.text,
  },
  goalRow: {
    backgroundColor: DESIGN.colors.surface,
    borderWidth: DESIGN.borders.heavy,
    borderColor: DESIGN.colors.cyan,
    borderRightColor: DESIGN.colors.pink,
    borderBottomColor: DESIGN.colors.yellow,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalInfo: {
    flex: 1,
  },
  goalCategory: {
    fontFamily: 'monospace',
    color: DESIGN.colors.mint,
    fontWeight: '900',
    fontSize: 11,
    marginBottom: 4,
  },
  goalTitle: {
    color: DESIGN.colors.text,
    fontWeight: '900',
    fontSize: 16,
  },
  disabledText: {
    color: DESIGN.colors.textDim,
  },
  switchBox: {
    minWidth: 58,
    alignItems: 'center',
    paddingVertical: 6,
    borderWidth: DESIGN.borders.pixel,
    borderColor: '#3B4352',
    backgroundColor: DESIGN.colors.bg,
  },
  switchOn: {
    borderColor: DESIGN.colors.mint,
    backgroundColor: '#12351F',
  },
  switchText: {
    fontFamily: 'monospace',
    color: DESIGN.colors.text,
    fontWeight: '900',
    fontSize: 12,
  },
  emptyCard: {
    padding: 20,
  },
  emptyText: {
    color: DESIGN.colors.textDim,
  },
});
