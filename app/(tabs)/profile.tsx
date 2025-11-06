import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useUser } from '@/contexts/UserContext';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View, useColorScheme } from 'react-native';

export default function ProfileScreen() {
  const { userProfile } = useUser();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Profile
          </ThemedText>
        </View>

        {/* Profile Picture */}
        <View style={styles.profileSection}>
          <View style={styles.profilePicturePlaceholder}>
            <IconSymbol name="person.crop.circle" size={100} color="#999" />
          </View>
        </View>

        {/* User Info */}
        <View style={styles.userInfoSection}>
          <ThemedText style={styles.fullName}>
            {userProfile.firstName} {userProfile.lastName}
          </ThemedText>
          <ThemedText style={styles.username}>@{userProfile.username}</ThemedText>
          {userProfile.location && (
            <View style={styles.locationRow}>
              <IconSymbol name="mappin" size={14} color={isDark ? '#8E8E93' : '#8E8E93'} />
              <ThemedText style={styles.locationText}>{userProfile.location}</ThemedText>
            </View>
          )}
          {userProfile.bio && (
            <ThemedText style={styles.bio}>{userProfile.bio}</ThemedText>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>
              {formatNumber(userProfile.followersCount)}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Followers</ThemedText>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>
              {formatNumber(userProfile.followingCount)}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Following</ThemedText>
          </View>
        </View>

        {/* Edit Profile Button */}
        <View style={styles.buttonSection}>
          <Pressable
            onPress={handleEditProfile}
            style={({ pressed }) => [
              styles.editButton,
              {
                backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7',
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <IconSymbol name="pencil" size={18} color={isDark ? '#fff' : '#000'} />
            <ThemedText style={styles.editButtonText}>Manage Profile</ThemedText>
          </Pressable>
        </View>

        {/* Travel Preferences */}
        {userProfile.travelPreferences && userProfile.travelPreferences.length > 0 && (
          <View style={styles.preferencesSection}>
            <ThemedText style={styles.sectionTitle}>Travel Interests</ThemedText>
            <View style={styles.preferencesContainer}>
              {userProfile.travelPreferences.map((preference) => (
                <View
                  key={preference}
                  style={[
                    styles.preferenceChip,
                    { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' },
                  ]}
                >
                  <ThemedText style={styles.preferenceText}>{preference}</ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoSection: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 16,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    opacity: 0.6,
  },
  bio: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.8,
  },
  statsSection: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.6,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
    opacity: 0.5,
  },
  buttonSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  preferencesSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  preferenceChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  preferenceText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
