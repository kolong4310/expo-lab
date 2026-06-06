import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getGoalTemplates, addGoalTemplate, updateGoalTemplate, deleteGoalTemplate, GoalTemplate } from '../database/db';
import { DESIGN } from '../theme/design';

const CATEGORIES = ['개발', '건강', '공부', '회사', '회고', '기타'];

export default function GoalManageScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [templates, setGoalTemplates] = useState<GoalTemplate[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('개발');
  const [isEditing, setIsEditing] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadTemplates();
    }, [])
  );

  const loadTemplates = () => {
    setGoalTemplates(getGoalTemplates());
  };

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addGoalTemplate(newTitle.trim(), selectedCategory);
    setNewTitle('');
    loadTemplates();
  };

  const handleToggleActive = (item: GoalTemplate) => {
    updateGoalTemplate(item.id!, item.title, item.category, item.is_active === 1 ? 0 : 1);
    loadTemplates();
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete Routine', 'This will also erase historical data for this routine. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        deleteGoalTemplate(id);
        loadTemplates();
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={24} color={DESIGN.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ROUTINE PROTOCOL</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.addSection}>
        <TextInput
          style={styles.input}
          value={newTitle}
          onChangeText={setNewTitle}
          placeholder="Define new growth routine..."
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
          <Text style={styles.addButtonText}>INITIALIZE ROUTINE</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={templates}
        keyExtractor={item => item.id?.toString() || ''}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 40 }]}
        renderItem={({ item }) => (
          <View style={[styles.templateItem, item.is_active === 0 && { opacity: 0.5 }]}>
            <View style={styles.templateInfo}>
              <Text style={styles.templateCategory}>{item.category}</Text>
              <Text style={styles.templateTitle}>{item.title}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleToggleActive(item)} style={styles.iconBtn}>
                <Ionicons 
                  name={item.is_active === 1 ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color={item.is_active === 1 ? DESIGN.colors.secondary : DESIGN.colors.textMuted} 
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id!)} style={styles.iconBtn}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No routines defined. Start your growth.</Text>
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
    padding: 24,
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
  },
  iconBtn: {
    padding: 10,
    marginLeft: 8,
  },
  emptyState: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: DESIGN.colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  }
});
