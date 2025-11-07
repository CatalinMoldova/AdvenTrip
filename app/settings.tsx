import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Settings state
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);

  const { setAuth } = useAuth();

  const onLogOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      Alert.alert('Sign Out', 'Error signing out'); 
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>Settings</ThemedText>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <IconSymbol name="person.fill" size={40} color="#fff" />
            </View>
            <View style={styles.profileInfo}>
              <ThemedText style={styles.profileName}>John Doe</ThemedText>
              <ThemedText style={styles.profileEmail}>john.doe@example.com</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#999" />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionHeader}>PREFERENCES</ThemedText>
          <View style={[styles.sectionCard, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
            <SettingToggle
              icon="bell.fill"
              iconColor="#ff9500"
              label="Push Notifications"
              value={pushEnabled}
              onValueChange={setPushEnabled}
              isDark={isDark}
            />
            <Separator isDark={isDark} />
            <SettingToggle
              icon="envelope.fill"
              iconColor="#007aff"
              label="Email Notifications"
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              isDark={isDark}
            />
            <Separator isDark={isDark} />
            <SettingToggle
              icon="location.fill"
              iconColor="#5856d6"
              label="Location Services"
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              isDark={isDark}
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionHeader}>PRIVACY</ThemedText>
          <View style={[styles.sectionCard, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
            <SettingToggle
              icon="lock.fill"
              iconColor="#ff3b30"
              label="Private Profile"
              value={privateProfile}
              onValueChange={setPrivateProfile}
              isDark={isDark}
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionHeader}>ACCOUNT</ThemedText>
          <View style={[styles.sectionCard, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
            <SettingRow
              icon="person.circle.fill"
              iconColor="#34c759"
              label="Edit Profile"
              isDark={isDark}
            />
            <Separator isDark={isDark} />
            <SettingRow
              icon="key.fill"
              iconColor="#ffcc00"
              label="Change Password"
              isDark={isDark}
            />
            <Separator isDark={isDark} />
            <SettingRow
              icon="creditcard.fill"
              iconColor="#007aff"
              label="Payment Methods"
              isDark={isDark}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionHeader}>SUPPORT</ThemedText>
          <View style={[styles.sectionCard, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
            <SettingRow
              icon="questionmark.circle.fill"
              iconColor="#5ac8fa"
              label="Help Center"
              isDark={isDark}
            />
            <Separator isDark={isDark} />
            <SettingRow
              icon="doc.text.fill"
              iconColor="#ff9500"
              label="Terms of Service"
              isDark={isDark}
            />
            <Separator isDark={isDark} />
            <SettingRow
              icon="hand.raised.fill"
              iconColor="#5856d6"
              label="Privacy Policy"
              isDark={isDark}
            />
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={onLogOut}>
            <ThemedText style={styles.signOutText}>Sign Out</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <View style={styles.versionContainer}>
          <ThemedText style={styles.versionText}>Version 1.0.0</ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

// Reusable Components
function SettingToggle({ 
  icon, 
  iconColor, 
  label, 
  value, 
  onValueChange, 
  isDark 
}: { 
  icon: any; 
  iconColor: string; 
  label: string; 
  value: boolean; 
  onValueChange: (value: boolean) => void;
  isDark: boolean;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
          <IconSymbol name={icon as any} size={18} color="#fff" />
        </View>
        <ThemedText style={styles.settingLabel}>{label}</ThemedText>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: '#34c759' }}
        thumbColor="#fff"
      />
    </View>
  );
}

function SettingRow({ 
  icon, 
  iconColor, 
  label, 
  isDark 
}: { 
  icon: any; 
  iconColor: string; 
  label: string; 
  isDark: boolean;
}) {
  return (
    <TouchableOpacity style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
          <IconSymbol name={icon as any} size={18} color="#fff" />
        </View>
        <ThemedText style={styles.settingLabel}>{label}</ThemedText>
      </View>
      <IconSymbol name="chevron.right" size={20} color="#999" />
    </TouchableOpacity>
  );
}

function Separator({ isDark }: { isDark: boolean }) {
  return <View style={[styles.separator, { backgroundColor: isDark ? '#38383a' : '#e5e5e7' }]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    marginTop: 70,
  },
  profileSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: -5,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007aff',
    borderRadius: 16,
    padding: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.6,
    marginBottom: 8,
    marginLeft: 20,
    letterSpacing: 0.5,
  },
  sectionCard: {
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  separator: {
    height: 0.5,
    marginLeft: 60,
  },
  signOutButton: {
    marginHorizontal: 20,
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 40,
  },
  versionText: {
    fontSize: 12,
    opacity: 0.5,
  },
});

