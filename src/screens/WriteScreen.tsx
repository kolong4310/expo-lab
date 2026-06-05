import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, LayoutAnimation } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { addLog, updateLog, WorkLog } from '../database/db';
import { DESIGN } from '../theme/design';

const MOODS = [
  { emoji: '🔥', value: 'best' },
  { emoji: '✨', value: 'good' },
  { emoji: '☁️', value: 'normal' },
  { emoji: '🌊', value: 'hard' },
];

export default function WriteScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as { log?: WorkLog } | undefined;
  const editingLog = params?.log;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [learned, setLearned] = useState('');
  const [issue, setIssue] = useState('');
  const [solution, setSolution] = useState('');
  const [memo, setMemo] = useState('');
  const [mood, setMood] = useState('good');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (editingLog) {
      setTitle(editingLog.title);
      setContent(editingLog.content || '');
      setLearned(editingLog.learned || '');
      setIssue(editingLog.issue || '');
      setSolution(editingLog.solution || '');
      setMemo(editingLog.memo || '');
      setMood(editingLog.mood || 'good');
      // If editing and has advanced content, show it
      if (editingLog.issue || editingLog.solution || editingLog.memo) {
        setShowAdvanced(true);
      }
    }
  }, [editingLog]);

  const toggleAdvanced = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowAdvanced(!showAdvanced);
  };

  const handleSave = () => {
    if (!title.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert('Incomplete', 'Every journey needs a name.');
      return;
    }

    try {
      const logData: WorkLog = {
        id: editingLog?.id,
        title,
        content,
        learned,
        issue,
        solution,
        memo,
        mood,
        date: editingLog ? editingLog.date : new Date().toISOString().split('T')[0],
      };

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (editingLog) {
        updateLog(logData);
        navigation.navigate('Detail', { log: logData });
      } else {
        addLog(logData);
        navigation.goBack();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const InsightInput = ({ label, value, onChangeText, placeholder, isAdvanced = false }: any) => (
    <View style={[styles.inputGroup, isAdvanced && styles.advancedGroup]}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={DESIGN.colors.textMuted}
        multiline
        textAlignVertical="top"
        selectionColor={DESIGN.colors.primary}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => {
              Haptics.selectionAsync();
              navigation.goBack();
            }} 
            style={styles.closeButton}
          >
            <Ionicons name="close-outline" size={28} color={DESIGN.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} style={styles.saveBadge}>
            <Text style={styles.saveBadgeText}>{editingLog ? 'UPDATE' : 'PUBLISH'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          <TextInput 
            style={styles.heroInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Insight Title"
            placeholderTextColor={DESIGN.colors.textMuted}
            selectionColor={DESIGN.colors.secondary}
          />

          <View style={styles.moodRow}>
            {MOODS.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.moodBox,
                  mood === item.value && styles.moodBoxSelected
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setMood(item.value);
                }}
              >
                <Text style={styles.moodEmoji}>{item.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <InsightInput 
            label="FLOW"
            value={content}
            onChangeText={setContent}
            placeholder="What was the sequence of events?"
          />

          <InsightInput 
            label="INTEL"
            value={learned}
            onChangeText={setLearned}
            placeholder="New knowledge or realization..."
          />

          {!showAdvanced ? (
            <TouchableOpacity style={styles.advancedToggle} onPress={toggleAdvanced}>
              <Ionicons name="add-outline" size={16} color={DESIGN.colors.primary} />
              <Text style={styles.advancedToggleText}>Add detailed reflection</Text>
            </TouchableOpacity>
          ) : (
            <>
              <InsightInput 
                label="BLOCK"
                value={issue}
                onChangeText={setIssue}
                placeholder="Obstacles encountered..."
                isAdvanced
              />

              <InsightInput 
                label="SOLVE"
                value={solution}
                onChangeText={setSolution}
                placeholder="Resolutions applied..."
                isAdvanced
              />

              <InsightInput 
                label="NOTE"
                value={memo}
                onChangeText={setMemo}
                placeholder="Additional context..."
                isAdvanced
              />

              <TouchableOpacity style={styles.advancedToggle} onPress={toggleAdvanced}>
                <Ionicons name="remove-outline" size={16} color={DESIGN.colors.textMuted} />
                <Text style={[styles.advancedToggleText, { color: DESIGN.colors.textMuted }]}>Show less</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingVertical: 10,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  saveBadge: {
    backgroundColor: DESIGN.colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: DESIGN.colors.bg,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
  },
  heroInput: {
    fontSize: 40,
    fontWeight: '900',
    color: DESIGN.colors.text,
    marginTop: 20,
    letterSpacing: -1.5,
    marginBottom: 20,
  },
  moodRow: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  moodBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: DESIGN.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
  },
  moodBoxSelected: {
    borderColor: DESIGN.colors.secondary,
    backgroundColor: 'transparent',
  },
  moodEmoji: {
    fontSize: 20,
  },
  inputGroup: {
    marginBottom: 32,
    borderLeftWidth: 1,
    borderLeftColor: DESIGN.colors.border,
    paddingLeft: 20,
  },
  advancedGroup: {
    borderLeftColor: DESIGN.colors.textMuted,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: DESIGN.colors.secondary,
    letterSpacing: 2,
    marginBottom: 12,
  },
  textInput: {
    fontSize: 16,
    color: DESIGN.colors.text,
    lineHeight: 26,
    minHeight: 40,
  },
  advancedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 40,
  },
  advancedToggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: DESIGN.colors.primary,
    marginLeft: 8,
  },
});
