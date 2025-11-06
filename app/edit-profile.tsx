import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useUser } from '@/contexts/UserContext';
import { TRAVEL_PREFERENCES } from '@/types/user';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';

export default function EditProfileScreen() {
  const { userProfile, updateUserProfile } = useUser();
  
  // Initialize local state with current user profile
  const [firstName, setFirstName] = useState(userProfile.firstName);
  const [lastName, setLastName] = useState(userProfile.lastName);
  const [username, setUsername] = useState(userProfile.username);
  const [bio, setBio] = useState(userProfile.bio || '');
  const [location, setLocation] = useState(userProfile.location || '');
  const [travelPreferences, setTravelPreferences] = useState<string[]>(
    userProfile.travelPreferences || []
  );

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Update local state if user profile changes
  useEffect(() => {
    setFirstName(userProfile.firstName);
    setLastName(userProfile.lastName);
    setUsername(userProfile.username);
    setBio(userProfile.bio || '');
    setLocation(userProfile.location || '');
    setTravelPreferences(userProfile.travelPreferences || []);
  }, [userProfile]);

  const handleSave = () => {
    // Basic validation
    if (!firstName.trim() || !lastName.trim() || !username.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Update the user profile through context
    updateUserProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      username: username.trim(),
      bio: bio.trim(),
      location: location.trim(),
      travelPreferences,
    });

    router.back();
  };

  const togglePreference = (preference: string) => {
    if (travelPreferences.includes(preference)) {
      setTravelPreferences(travelPreferences.filter((p) => p !== preference));
    } else {
      setTravelPreferences([...travelPreferences, preference]);
    }
  };

  const inputBgColor = isDark ? '#2C2C2E' : '#F2F2F7';
  const inputTextColor = isDark ? '#FFFFFF' : '#000000';
  const borderColor = isDark ? '#3A3A3C' : '#E5E5EA';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <IconSymbol name="xmark" size={24} color={inputTextColor} />
          </Pressable>
          <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
            Edit Profile
          </ThemedText>
          <Pressable onPress={handleSave} style={styles.headerButton}>
            <ThemedText style={styles.saveText}>Save</ThemedText>
          </Pressable>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Profile Picture */}
          <View style={styles.section}>
            <View style={styles.profilePictureContainer}>
              <View style={styles.profilePicturePlaceholder}>
                <IconSymbol name="person.crop.circle" size={100} color="#999" />
              </View>
              <Pressable style={styles.changePhotoButton}>
                <ThemedText style={styles.changePhotoText}>Change Photo</ThemedText>
              </Pressable>
            </View>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>First Name</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: inputBgColor, color: inputTextColor },
                ]}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter your first name"
                placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Last Name</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: inputBgColor, color: inputTextColor },
                ]}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter your last name"
                placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Username</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: inputBgColor, color: inputTextColor },
                ]}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Location</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: inputBgColor, color: inputTextColor },
                ]}
                value={location}
                onChangeText={setLocation}
                placeholder="Enter your location"
                placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Bio</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { backgroundColor: inputBgColor, color: inputTextColor },
                ]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself..."
                placeholderTextColor={isDark ? '#8E8E93' : '#8E8E93'}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Travel Preferences */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Travel Preferences</ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              Select activities you enjoy while traveling
            </ThemedText>

            <View style={styles.preferencesContainer}>
              {TRAVEL_PREFERENCES.map((preference) => {
                const isSelected = travelPreferences.includes(preference);
                return (
                  <Pressable
                    key={preference}
                    onPress={() => togglePreference(preference)}
                    style={[
                      styles.preferenceChip,
                      {
                        backgroundColor: isSelected
                          ? '#4facfe'
                          : isDark
                            ? '#2C2C2E'
                            : '#F2F2F7',
                        borderColor: isSelected ? '#4facfe' : borderColor,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.preferenceText,
                        { color: isSelected ? '#fff' : inputTextColor },
                      ]}
                    >
                      {preference}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  headerButton: {
    padding: 8,
    minWidth: 60,
  },
  headerTitle: {
    fontSize: 18,
  },
  saveText: {
    color: '#4facfe',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 16,
  },
  profilePictureContainer: {
    alignItems: 'center',
    gap: 16,
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changePhotoText: {
    color: '#4facfe',
    fontSize: 16,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.8,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  preferenceChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  preferenceText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 40,
  },
});

