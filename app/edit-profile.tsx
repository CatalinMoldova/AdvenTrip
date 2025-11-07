import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/contexts/AuthContext';
import { getUserData, updateUserProfile } from '@/services/userService';
import { TRAVEL_PREFERENCES } from '@/types/user';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user } = useAuth();
  
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Edit form state
  const [editName, setEditName] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editInterests, setEditInterests] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const result = await getUserData(user.user.id);
        if (result.success && result.data) {
          setUserData(result.data);
          
          // Populate form with current data
          const currentName = result.data?.name || user?.user?.user_metadata?.name || user?.user?.email?.split('@')[0] || '';
          const currentLocation = result.data?.location || '';
          const currentInterests = parseJsonbArray(result.data?.interests);
          
          setEditName(currentName);
          setEditLocation(currentLocation);
          setEditInterests(currentInterests);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Helper function to parse JSONB array from Supabase
  const parseJsonbArray = (value: any): string[] => {
    if (!value) return [];
    
    // If it's already an array, return it
    if (Array.isArray(value)) {
      return value;
    }
    
    // If it's a string, try to parse it
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    
    // If it's an object with an array property (like {images: [...]})
    if (typeof value === 'object' && value !== null) {
      // Check for common array properties
      if (Array.isArray(value.images)) return value.images;
      if (Array.isArray(value.items)) return value.items;
      if (Array.isArray(value.data)) return value.data;
    }
    
    return [];
  };

  // Toggle interest selection
  const toggleInterest = (interest: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (editInterests.includes(interest)) {
      setEditInterests(editInterests.filter(i => i !== interest));
    } else {
      setEditInterests([...editInterests, interest]);
    }
  };

  // Save profile changes
  const handleSave = async () => {
    if (!user?.user?.id) {
      Alert.alert('Error', 'User not found');
      return;
    }

    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const updates: any = {};
      
      if (editName.trim()) {
        updates.name = editName.trim();
      }
      
      if (editLocation.trim()) {
        updates.location = editLocation.trim();
      }
      
      // Always update interests (even if empty array to clear them)
      updates.interests = editInterests;

      const result = await updateUserProfile(user.user.id, updates);
      
      if (result.success) {
        Alert.alert('Success', 'Profile updated successfully!');
        // Refresh user data
        const refreshResult = await getUserData(user.user.id);
        if (refreshResult.success && refreshResult.data) {
          setUserData(refreshResult.data);
        }
        router.back();
      } else {
        Alert.alert('Error', result.msg || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={[
          styles.header,
          { borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }
        ]}>
          <Pressable onPress={() => router.back()} style={styles.headerButton}>
            <IconSymbol name="chevron.left" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
            Edit Profile
          </Text>
          <View style={styles.headerButton} />
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Name Input */}
          <View style={styles.section}>
            <ThemedInput
              label="Name"
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter your name"
              autoCapitalize="words"
            />
          </View>

          {/* Location Input */}
          <View style={styles.section}>
            <ThemedInput
              label="Location"
              value={editLocation}
              onChangeText={setEditLocation}
              placeholder="Enter your city"
              autoCapitalize="words"
            />
          </View>

          {/* Interests Selection */}
          <View style={styles.section}>
            <Text style={[styles.interestsLabel, { color: isDark ? '#FFFFFF' : '#000000' }]}>
              Interests
            </Text>
            <Text style={[styles.interestsSubtext, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
              Select your travel preferences
            </Text>
            <View style={styles.interestsGrid}>
              {TRAVEL_PREFERENCES.map((interest) => {
                const isSelected = editInterests.includes(interest);
                return (
                  <Pressable
                    key={interest}
                    onPress={() => toggleInterest(interest)}
                    style={({ pressed }) => [
                      styles.interestChip,
                      {
                        backgroundColor: isSelected 
                          ? (isDark ? '#69B6FF' : '#CFEFFF')
                          : (isDark ? '#2C2C2E' : '#F2F2F7'),
                        borderColor: isSelected 
                          ? (isDark ? '#007AFF' : '#69B6FF')
                          : (isDark ? '#3A3A3C' : '#DFDFDF'),
                        opacity: pressed ? 0.7 : 1,
                      },
                    ]}
                  >
                    <Text 
                      style={[
                        styles.interestText,
                        { color: isDark ? '#FFFFFF' : '#000000' },
                        isSelected && styles.interestTextSelected
                      ]}
                    >
                      {interest}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {editInterests.length > 0 && (
              <Text style={[styles.selectedCount, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
                {editInterests.length} {editInterests.length === 1 ? 'interest' : 'interests'} selected
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Footer with Save Button */}
        <View style={[
          styles.footer,
          { borderTopColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }
        ]}>
          <ThemedButton
            title="Save"
            onPress={handleSave}
            loading={saving}
            style={styles.saveButton}
          />
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerButton: {
    padding: 8,
    minWidth: 44,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'NewSpirit-SemiBold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 0,
  },
  interestsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    opacity: 0.8,
  },
  interestsSubtext: {
    fontSize: 12,
    marginBottom: 16,
    opacity: 0.6,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  interestText: {
    fontSize: 14,
    fontWeight: '500',
  },
  interestTextSelected: {
    fontWeight: '600',
  },
  selectedCount: {
    fontSize: 12,
    marginTop: 16,
    textAlign: 'center',
    opacity: 0.6,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  saveButton: {
    width: '100%',
  },
});

