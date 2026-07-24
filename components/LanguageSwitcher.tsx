import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { AppLanguage } from '@/constants/translations';
import { colors } from '@/constants/colors';
import { useAppStore } from '@/store/useAppStore';

export const LanguageSwitcher: React.FC = () => {
  const { settings, updateSettings } = useAppStore();
  
  const languages: { code: AppLanguage; label: string }[] = [
    { code: 'zh', label: '中' },
    { code: 'en', label: 'EN' },
    { code: 'ja', label: '日' },
    { code: 'ko', label: '한' },
  ];
  
  const handleLanguageChange = (language: AppLanguage) => {
    updateSettings({ language });
  };
  
  return (
    <View style={styles.container}>
      {languages.map((lang) => (
        <Pressable
          key={lang.code}
          style={[
            styles.languageButton,
            settings.language === lang.code && styles.activeLanguage,
          ]}
          onPress={() => handleLanguageChange(lang.code)}
        >
          <Text
            style={[
              styles.languageText,
              settings.language === lang.code && styles.activeLanguageText,
            ]}
          >
            {lang.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 20,
    backgroundColor: colors.border,
    padding: 4,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeLanguage: {
    backgroundColor: colors.primary,
  },
  languageText: {
    fontSize: 14,
    color: colors.textLight,
  },
  activeLanguageText: {
    color: colors.background,
    fontWeight: 'bold',
  },
});