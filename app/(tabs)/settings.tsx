import React from 'react';
import { StyleSheet, Text, View, Switch, ScrollView, Pressable } from 'react-native';
import { useAppStore } from '@/store/useAppStore';
import { colors } from '@/constants/colors';
import { AppLanguage, useI18n } from '@/constants/translations';
import { triggerLightHaptic, triggerToggleHaptic } from '@/utils/haptics';

export default function SettingsScreen() {
  const { settings, updateSettings } = useAppStore();
  const { t } = useI18n();

  const handleLanguagePress = (languageCode: AppLanguage) => {
    triggerLightHaptic(settings.vibration).catch(() => {});
    updateSettings({ language: languageCode });
  };

  const handleSoundToggle = (value: boolean) => {
    triggerToggleHaptic(settings.vibration, value).catch(() => {});
    updateSettings({ sound: value });
  };

  const handleVibrationToggle = (value: boolean) => {
    const shouldVibrate = value || settings.vibration;
    triggerToggleHaptic(shouldVibrate, value).catch(() => {});
    updateSettings({ vibration: value });
  };

  const languages: Array<{ code: AppLanguage; labelKey: string }> = [
    { code: 'zh', labelKey: 'settings.languages.zh' },
    { code: 'en', labelKey: 'settings.languages.en' },
    { code: 'ja', labelKey: 'settings.languages.ja' },
    { code: 'ko', labelKey: 'settings.languages.ko' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
        <View style={styles.languageContainer}>
          {languages.map(lang => (
            <Pressable
              key={lang.code}
              style={[
                styles.languageButton,
                settings.language === lang.code && styles.activeLanguageButton,
              ]}
              onPress={() => handleLanguagePress(lang.code)}
            >
              <Text
                style={[
                  styles.languageButtonText,
                  settings.language === lang.code && styles.activeLanguageButtonText,
                ]}
              >
                {t(lang.labelKey)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>{t('settings.sound')}</Text>
          <Switch
            value={settings.sound}
            onValueChange={handleSoundToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>{t('settings.vibration')}</Text>
          <Switch
            value={settings.vibration}
            onValueChange={handleVibrationToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.background}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
        <Text style={styles.aboutText}>{t('settings.about_desc')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  section: {
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 16 },
  languageContainer: { flexDirection: 'column', gap: 8 },
  languageButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  activeLanguageButton: { backgroundColor: colors.primary },
  languageButtonText: { fontSize: 16, color: colors.text, textAlign: 'center' },
  activeLanguageButtonText: { color: colors.background, fontWeight: 'bold' },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLabel: { fontSize: 16, color: colors.text },
  aboutText: { fontSize: 14, color: colors.text, lineHeight: 22 },
});
