import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getAllGoals, addGoal, updateGoal, getCurrentStreak, getAllLogs, Goal } from '../database/db';
import { DESIGN } from '../theme/design';
import RetroCard from '../components/RetroCard';
import RetroButton from '../components/RetroButton';

const CATEGORIES = ['건강', '공부', '일', '생활', '성장', '기타'];

export default function GoalManageScreen() {
  const insets = useSafeAreaInsets();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('성장');
  const [streak, setStreak] = useState(0);
  const [logCount, setLogCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadSystem();
    }, [])
  );

  const loadSystem = () => {
    setGoals(getAllGoals());
    setStreak(getCurrentStreak());
    setLogCount(getAllLogs().length);
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addGoal(newTitle.trim(), selectedCategory);
    setNewTitle('');
    loadSystem();
  };

  const handleToggleActive = (item: Goal) => {
    updateGoal(item.id!, item.title, item.category, item.is_active === 1 ? 0 : 1);
    loadSystem();
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
            <Text style={styles.screenTitle}>SYSTEM</Text>
            <Text style={styles.screenSub}>설정 / 관리 / 상태</Text>

            <RetroCard accent="cyan" style={styles.levelCard}>
              <Text style={styles.cardTitle}>LEVEL 12</Text>
              <View style={styles.expRow}>
                <Text style={styles.expLabel}>EXP</Text>
                <Text style={styles.expValue}>{logCount * 120} / 3000</Text>
              </View>
              <View style={styles.expBar}>
                {Array.from({ length: 12 }, (_, index) => (
                  <View key={index} style={[styles.expBlock, index < Math.min(12, Math.ceil(logCount / 3)) && styles.expBlockOn]} />
                ))}
              </View>
            </RetroCard>

            <View style={styles.menuList}>
              {['반복 목표 관리', '카테고리 관리', '백업 및 복원', '설정', '정보'].map((label, index) => (
                <RetroCard key={label} accent={index === 0 ? 'yellow' : 'green'} style={styles.menuItem}>
                  <Text style={styles.menuIcon}>{['◆', '▤', '▣', '⚙', 'ⓘ'][index]}</Text>
                  <Text style={styles.menuText}>{label}</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </RetroCard>
              ))}
            </View>

            <RetroCard accent="green" style={styles.statsCard}>
              <Text style={styles.cardTitle}>STATS</Text>
              <View style={styles.statLine}>
                <Text style={styles.statLabel}>기록한 날</Text>
                <Text style={styles.statValue}>{streak}일</Text>
              </View>
              <View style={styles.statLine}>
                <Text style={styles.statLabel}>총 기록 수</Text>
                <Text style={styles.statValue}>{logCount}개</Text>
              </View>
              <View style={styles.statLine}>
                <Text style={styles.statLabel}>반복 목표</Text>
                <Text style={styles.statValue}>{goals.filter(g => g.is_active === 1).length}개 ON</Text>
              </View>
            </RetroCard>

            <Text style={styles.sectionTitle}>ROUTINE SETUP</Text>
            <RetroCard accent="pink" style={styles.addPanel}>
              <TextInput
                style={styles.input}
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="매일 반복할 목표 입력"
                placeholderTextColor={DESIGN.colors.textDim}
                selectionColor={DESIGN.colors.primary}
                returnKeyType="done"
                onSubmitEditing={handleAdd}
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
              <RetroButton label="매일 반복할 목표 추가" onPress={handleAdd} />
            </RetroCard>

            <Text style={styles.sectionTitle}>ROUTINE LIST</Text>
          </>
        }
        ListEmptyComponent={
          <RetroCard accent="purple" style={styles.emptyCard}>
            <Text style={styles.emptyText}>등록된 반복 목표가 없습니다.</Text>
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
  levelCard: {
    padding: 16,
    marginBottom: 18,
  },
  cardTitle: {
    fontFamily: 'monospace',
    color: DESIGN.colors.yellow,
    fontWeight: '900',
    fontSize: 16,
    marginBottom: 12,
  },
  expRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  expLabel: {
    fontFamily: 'monospace',
    color: DESIGN.colors.primaryLight,
    fontWeight: '900',
  },
  expValue: {
    fontFamily: 'monospace',
    color: DESIGN.colors.text,
    fontWeight: '900',
  },
  expBar: {
    flexDirection: 'row',
  },
  expBlock: {
    flex: 1,
    height: 10,
    backgroundColor: DESIGN.colors.bg,
    borderWidth: 1,
    borderColor: '#2F3542',
    marginRight: 3,
  },
  expBlockOn: {
    backgroundColor: DESIGN.colors.primaryLight,
    borderColor: DESIGN.colors.yellow,
  },
  menuList: {
    marginBottom: 18,
  },
  menuItem: {
    minHeight: 48,
    marginBottom: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    fontFamily: 'monospace',
    color: DESIGN.colors.primary,
    fontWeight: '900',
    width: 28,
  },
  menuText: {
    flex: 1,
    color: DESIGN.colors.text,
    fontWeight: '800',
  },
  menuArrow: {
    fontFamily: 'monospace',
    color: DESIGN.colors.mint,
    fontWeight: '900',
    fontSize: 22,
  },
  statsCard: {
    padding: 16,
    marginBottom: 22,
  },
  statLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    color: DESIGN.colors.textDim,
  },
  statValue: {
    fontFamily: 'monospace',
    color: DESIGN.colors.text,
    fontWeight: '900',
  },
  sectionTitle: {
    fontFamily: 'monospace',
    color: DESIGN.colors.yellow,
    fontWeight: '900',
    marginBottom: 12,
  },
  addPanel: {
    padding: 16,
    marginBottom: 22,
  },
  input: {
    minHeight: 46,
    color: DESIGN.colors.text,
    backgroundColor: DESIGN.colors.bg,
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.primaryLight,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  categoryRow: {
    marginBottom: 16,
  },
  catChip: {
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.primaryLight,
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
    borderColor: DESIGN.colors.primaryLight,
    borderRightColor: DESIGN.colors.primary,
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
