import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color={DESIGN.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>GOAL PROTOCOL</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.addSection}>
        <TextInput
          style={styles.input}
          value={newTitle}
          onChangeText={setNewTitle}
          placeholder="New growth goal..."
          placeholderTextColor={DESIGN.colors.textMuted}
          selectionColor={DESIGN.colors.primary}
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
          <Text style={styles.addButtonText}>INITIALIZE GOAL</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={goals}
        keyExtractor={item => item.id?.toString() || ''}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 40 }]}
        renderItem={({ item }) => (
          <View style={[styles.templateItem, item.is_active === 0 && { opacity: 0.3 }]}>
            <View style={styles.templateInfo}>
              <Text style={styles.templateCategory}>{item.category}</Text>
              <Text style={styles.templateTitle}>{item.title}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleToggleActive(item)} style={styles.iconBtn}>
                <Ionicons 
                  name={item.is_active === 1 ? "checkbox" : "square-outline"} 
                  size={24} 
                  color={item.is_active === 1 ? DESIGN.colors.secondary : DESIGN.colors.textDim} 
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No goals defined. Set your growth targets.</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.colors.border,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: DESIGN.colors.text,
    letterSpacing: 3,
  },
  addSection: {
    padding: 24,
    backgroundColor: DESIGN.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.colors.border,
  },
  input: {
    fontSize: 18,
    color: DESIGN.colors.text,
    fontWeight: '600',
    marginBottom: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
    marginRight: 8,
  },
  catChipSelected: {
    borderColor: DESIGN.colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  catText: {
    fontSize: 12,
    color: DESIGN.colors.textDim,
    fontWeight: '700',
  },
  catTextSelected: {
    color: DESIGN.colors.primary,
  },
  addButton: {
    backgroundColor: DESIGN.colors.primary,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 11,
    fontWeight: '900',
    color: DESIGN.colors.text,
    letterSpacing: 2,
  },
  list: {
    paddingHorizontal: 24,
  },
  templateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.colors.border,
  },
  templateInfo: {
    flex: 1,
  },
  templateCategory: {
    fontSize: 10,
    fontWeight: '900',
    color: DESIGN.colors.secondary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN.colors.text,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 10,
  },
  emptyState: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: DESIGN.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  }
});
