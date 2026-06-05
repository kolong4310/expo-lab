import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { WorkLog } from '../database/db';
import { Colors, Spacing, Typography } from '../theme/theme';

export default function DetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { log } = route.params as { log: WorkLog };

  const InfoSection = ({ icon, label, content }: { icon: any, label: string, content: string }) => {
    if (!content || content.trim() === '') return null;
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name={icon} size={18} color={Colors.primary} style={styles.sectionIcon} />
          <Text style={styles.sectionLabel}>{label}</Text>
        </View>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionText}>{content}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>상세 보기</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Write', { log })}
        >
          <Text style={styles.editText}>수정</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Spacing.xl }}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.dateText}>{log.date}</Text>
          <Text style={styles.titleText}>{log.title}</Text>
        </View>

        <View style={styles.divider} />

        <InfoSection icon="document-text" label="상세 내용" content={log.content} />
        <InfoSection icon="bulb" label="배운 것" content={log.learned} />
        <InfoSection icon="alert-circle" label="이슈" content={log.issue} />
        <InfoSection icon="checkmark-circle" label="해결 방법" content={log.solution} />
        <InfoSection icon="attach" label="메모" content={log.memo} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  editText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    padding: Spacing.lg,
  },
  dateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: '500',
  },
  titleText: {
    ...Typography.h1,
    color: Colors.text,
  },
  divider: {
    height: 8,
    backgroundColor: Colors.background,
    marginVertical: Spacing.sm,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionIcon: {
    marginRight: Spacing.xs,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionText: {
    ...Typography.body,
    lineHeight: 24,
  },
});
