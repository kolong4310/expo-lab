import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getAllGoals, addGoal, updateGoal, Goal } from '../database/db';
import { DESIGN } from '../theme/design';

const CATEGORIES = ['건강', '공부', '일', '생활', '성장', '기타'];

export default function GoalManageScreen() {
  const navigation = useNavigation<any>();
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DESIGN.colors.bg} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={DESIGN.colors.primary} />
          <Text style={styles.backText}>돌아가기</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>반복 목표 관리</Text>
        <View style={{ width: 80 }} />
      </View>

      <View style={styles.addSection}>
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
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>매일 반복할 목표 추가</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={goals}
        keyExtractor={item => item.id?.toString() || ''}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 20 }]}
        renderItem={({ item }) => (
          <View style={styles.templateItem}>
            <View style={styles.templateInfo}>
              <Text style={styles.templateCategory}>{item.category}</Text>
              <Text style={[styles.templateTitle, item.is_active === 0 && styles.textMuted]}>
                {item.title}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleToggleActive(item)} style={styles.toggleBtn}>
              <Ionicons
                name={item.is_active === 1 ? 'checkmark-circle' : 'ellipse-outline'}
                size={28}
                color={item.is_active === 1 ? DESIGN.colors.primary : DESIGN.colors.border}
              />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>등록된 반복 목표가 없습니다.</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: DESIGN.borders.pixel,
    borderBottomColor: DESIGN.colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  backText: {
    fontSize: 17,
    color: DESIGN.colors.primary,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: DESIGN.colors.yellow,
    fontFamily: 'monospace',
  },
  addSection: {
    padding: 24,
    backgroundColor: DESIGN.colors.surface,
    borderBottomWidth: DESIGN.borders.heavy,
    borderBottomColor: DESIGN.colors.primary,
  },
  input: {
    fontSize: 17,
    color: DESIGN.colors.text,
    backgroundColor: DESIGN.colors.bgSecondary,
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: DESIGN.colors.bgSecondary,
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.border,
    marginRight: 8,
  },
  catChipSelected: {
    backgroundColor: DESIGN.colors.primary,
    borderColor: DESIGN.colors.yellow,
  },
  catText: {
    fontSize: 13,
    color: DESIGN.colors.text,
    fontWeight: '900',
    fontFamily: 'monospace',
  },
  catTextSelected: {
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: DESIGN.colors.primary,
    height: 50,
    borderWidth: DESIGN.borders.heavy,
    borderColor: DESIGN.colors.yellow,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  list: {
    paddingHorizontal: 20,
  },
  templateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: DESIGN.colors.bgSecondary,
    borderWidth: DESIGN.borders.pixel,
    borderColor: DESIGN.colors.border,
    borderRadius: 12,
    marginBottom: 12,
  },
  templateInfo: {
    flex: 1,
  },
  templateCategory: {
    fontSize: 12,
    fontWeight: '900',
    color: DESIGN.colors.mint,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  templateTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: DESIGN.colors.text,
    fontFamily: 'monospace',
  },
  textMuted: {
    color: DESIGN.colors.textDim,
  },
  toggleBtn: {
    padding: 4,
  },
  emptyState: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: DESIGN.colors.textDim,
    fontSize: 15,
  },
});
