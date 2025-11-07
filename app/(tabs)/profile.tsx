import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { getUserData } from '@/services/userService';
import * as Haptics from 'expo-haptics';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, setAuth } = useAuth();
  
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    if (!user?.user?.id) {
      setLoading(false);
      return;
    }

    try {
      const result = await getUserData(user.user.id);
      if (result.success && result.data) {
        setUserData(result.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Refresh data when screen comes into focus (e.g., returning from edit screen)
  useFocusEffect(
    useCallback(() => {
      if (user?.user?.id) {
        fetchUserData();
      }
    }, [user, fetchUserData])
  );

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

  // Navigate to edit profile screen
  const openEditProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/edit-profile');
  };

  // Handle sign out
  const handleSignOut = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.auth.signOut();
              if (error) {
                Alert.alert('Error', 'Failed to sign out. Please try again.');
              } else {
                setAuth(null);
                // Auth listener in _layout.tsx will automatically redirect to welcome
              }
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Something went wrong. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Get user's name from auth metadata or database
  const userName = userData?.name || user?.user?.user_metadata?.name || user?.user?.email?.split('@')[0] || 'User';
  const userLocation = userData?.location || '';
  // Parse interests from JSONB - handle both array and string formats
  const userInterests = parseJsonbArray(userData?.interests);

  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Colored Banner Section */}
          <View style={styles.bannerSection}>
            {/* SVG Background */}
            <View style={styles.svgContainer}>
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 804 392"
                preserveAspectRatio="xMidYMid slice"
              >
                <G>
                  <Path 
                    d="M99.188 0.921898C108.116 1.73355 115.073 4.51633 121.103 11.9372C127.016 16.2273 118.32 31.185 126.089 34.6635C153.453 40.1132 181.165 23.5322 207.718 19.7058C230.908 12.7488 255.837 9.03845 278.332 7.64705C310.566 -0.469486 350.221 -4.29583 383.151 7.29921C390.572 9.61822 402.978 12.5169 409.356 18.6623C416.429 23.8801 422.226 34.4317 426.285 42.3163C429.647 48.2298 432.082 52.4039 436.372 59.9406C446.112 76.8694 469.998 66.6658 484.492 61.448C502.58 57.3898 521.02 52.172 539.22 50.7806C564.5 48.4616 601.72 40.693 626.07 54.839C628.62 56.2304 628.73 58.7812 630.71 60.7524C636.62 63.7671 640.79 68.7529 642.18 75.594C643.58 84.4063 649.14 85.7976 650.76 93.1025C653.66 103.654 652.74 113.162 652.16 123.597C652.16 126.728 651.34 127.772 652.62 131.018C659.58 135.308 671.87 129.163 681.38 129.627C694.48 128.583 703.87 118.032 717.2 116.872C736.8 113.046 753.96 100.987 773.79 97.5086C784.69 96.1172 795.01 94.3779 805.91 91.1313C813.44 89.624 817.73 87.8847 824.46 85.1019C828.86 83.9424 830.95 84.0585 836.75 82.899C850.08 79.7683 856.46 75.7099 872.11 72.8111C886.03 68.8688 900.99 67.8253 914.55 65.7382C922.32 64.8106 931.48 64.4627 937.86 61.7959C958.03 55.6505 982.85 55.1867 1002.21 51.1285C1014.62 47.0702 1024.24 46.3745 1037.23 46.9542C1063.55 41.9684 1089.98 40.9249 1116.19 37.7942C1151.44 38.374 1186.57 38.0261 1219.85 37.5623C1226.46 38.8377 1231.79 41.1567 1235.5 41.5046C1240.37 42.4322 1247.1 41.1567 1253.13 42.5481C1260.66 44.4033 1267.16 51.4764 1271.68 56.4623C1272.26 56.8101 1272.61 56.926 1272.95 56.926C1275.85 55.9984 1277.59 54.7229 1280.26 58.2014C1280.96 59.1291 1282.23 60.1726 1282.93 61.1002C1286.64 64.5787 1292.55 64.115 1296.14 68.4051C1296.14 67.9413 1298.7 73.0431 1298.46 73.0431C1299.51 76.5216 1300.2 79.6523 1300.55 83.5946C1302.06 97.0449 1303.57 113.626 1283.62 110.843C1230.05 106.901 1167.21 102.379 1106.33 106.089C1008.36 110.495 889.97 128.004 790.83 156.411C735.06 170.326 677.78 182.964 624.21 206.154C586.3 220.764 541.31 226.561 506.52 243.838C489.014 252.882 480.781 261.694 464.548 267.956C447.967 274.797 434.285 287.088 417.24 292.073C399.616 297.639 392.775 309.814 375.498 317.814C351.033 329.873 325.292 350.165 303.377 360.484C286.332 369.296 272.07 374.398 255.026 384.834C248.416 387.617 239.604 391.791 234.039 391.907C223.487 393.066 214.211 383.211 217.806 373.239C220.241 365.586 224.531 357.469 230.676 351.788C241.228 342.976 252.243 339.729 259.316 331.497C276.824 313.872 303.957 298.683 324.712 288.015C333.06 284.653 340.249 283.261 346.627 277.812C362.28 265.637 383.615 258.912 399.848 250.563C405.645 246.273 409.82 246.969 415.501 243.258C419.443 241.055 420.371 240.476 423.502 237.925C429.995 233.75 433.473 232.475 440.315 229.228C488.666 216.474 559.4 167.543 590.35 140.642C636.04 94.9577 534.7 116.061 510.58 120.003C434.865 137.28 348.598 147.599 288.419 195.139C263.954 208.473 244.59 221.923 220.82 236.649C208.298 244.998 198.094 254.853 185.803 262.042C173.629 269.811 157.627 273.405 146.148 281.174C106.145 312.597 57.562 334.859 10.486 354.107C-16.762 364.89 -39.72 345.063 -20.704 316.887C-2.03601 294.74 24.052 286.392 45.503 267.028C60.345 254.853 74.839 244.65 89.217 233.287C104.29 224.822 116.233 219.373 133.162 207.662C150.554 199.313 167.251 184.471 186.035 179.138C201.225 173.224 216.762 161.861 233.459 158.267C248.88 147.715 265.693 142.382 284.709 139.599C300.014 138.207 310.682 134.845 325.524 124.177C336.887 114.901 394.978 78.6087 372.136 65.2744C334.916 55.8825 269.056 66.3181 227.43 73.8548C150.438 94.9578 65.447 103.422 14.776 160.47C10.37 164.296 6.54401 167.195 2.83401 170.441C-18.038 185.863 -34.503 208.937 -59.78 222.271C-67.432 226.214 -74.737 230.156 -80.883 236.185C-93.869 251.143 -113.929 264.477 -130.51 272.594C-134.916 276.652 -141.293 281.754 -146.974 283.841C-161.816 295.552 -176.89 310.278 -193.471 318.974C-209.936 326.627 -225.473 338.222 -241.706 343.903C-262.925 361.18 -289.709 369.644 -317.074 367.325C-332.147 366.862 -331.22 356.542 -323.915 342.976C-269.998 244.418 -161.004 176.703 -65.229 126.264C-28.009 102.263 14.081 90.4356 53.852 70.4922C116.001 25.7353 -5.28301 42.896 -26.85 48.1138C-47.257 52.7518 -70.563 58.0855 -88.999 65.6223C-208.776 101.335 -330.872 158.846 -435.923 241.635C-453.431 257.52 -467.693 281.754 -485.55 296.016C-491.927 301.118 -497.609 303.9 -499 302.045C-401.718 113.162 -114.045 12.4009 96.985 0.689947H98.724L99.188 0.921898ZM1243.85 47.1862C1232.6 39.7654 1235.39 53.2156 1239.79 54.9549C1243.62 56.3463 1245.71 52.4039 1243.04 59.1291C1254.75 57.3898 1248.95 53.5635 1243.97 47.1862H1243.85ZM-47.953 174.384C-41.112 163.832 -86.332 193.168 -88.767 194.327C-99.783 200.937 -114.972 210.908 -127.031 216.706C-135.379 218.445 -141.641 224.822 -149.641 230.388C-175.382 250.099 -203.21 268.768 -225.357 291.262C-201.355 293.349 -97.348 206.038 -48.764 175.08L-47.837 174.268L-47.953 174.384Z" 
                    fill="#D6E0F7"
                    fillOpacity="0.4"
                  />
                </G>
              </Svg>
            </View>

            <View style={styles.bannerHeader}>
              <Text style={styles.bannerTitle}></Text>
              <Pressable
                onPress={openEditProfile}
                style={({ pressed }) => [
                  styles.settingsButton,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <IconSymbol name="gear" size={20} color="#000000" />
              </Pressable>
            </View>
          </View>

          {/* Profile Picture - Positioned between banner and container */}
          <View style={styles.profilePictureContainer}>
            <View style={[styles.profilePicture, { backgroundColor: '#ACE2FF' }]}>
              <Text style={styles.profileEmoji}>🏄</Text>
            </View>
            {/* User Info below profile picture */}
            <View style={styles.userInfoSection}>
              <Text style={[styles.userName, { color: isDark ? '#fff' : '#000' }]}>
                {userName}
              </Text>
              {userLocation && (
                <Text style={[styles.userLocation, { color: isDark ? '#fff' : '#000' }]}>
                  📍 {userLocation}
                </Text>
              )}
            </View>
          </View>

          {/* White Container Section */}
          <View style={isDark ? styles.darkContainer : styles.lightContainer}>
            <ScrollView 
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >

              {/* Trip Plans Section */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                  Trip Plans
                </Text>
                <View style={[styles.tripPlansCard, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                  <Text style={[styles.noTripsText, { color: isDark ? '#8E8E93' : '#8E8E93' }]}>
                    No trip plans yet
                  </Text>
                </View>
              </View>

              {/* Interests Section */}
              {userInterests && userInterests.length > 0 && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                    Interests
                  </Text>
                  <View style={styles.interestsContainer}>
                    {userInterests.map((interest: string, index: number) => (
                      <View
                        key={`${interest}-${index}`}
                        style={[
                          styles.interestChip,
                          { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' },
                        ]}
                      >
                        <Text style={[styles.interestText, { color: isDark ? '#FFFFFF' : '#000000' }]}>
                          {interest}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Sign Out Button */}
              <View style={styles.section}>
                <Pressable
                  onPress={handleSignOut}
                  style={({ pressed }) => [
                    styles.signOutButton,
                    { opacity: pressed ? 0.7 : 1 },
                    { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' },
                  ]}
                >
                  <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#FF3B30" />
                  <Text style={[styles.signOutText, { color: '#FF3B30' }]}>Sign Out</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#B8CAF5',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#B8CAF5',
  },
  container: {
    flex: 1,
  },
  bannerSection: {
    backgroundColor: '#B8CAF5',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 80,
    position: 'relative',
    overflow: 'hidden',
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  bannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  bannerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'NewSpirit-SemiBold',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profilePictureContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    zIndex: 10,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileEmoji: {
    fontSize: 50,
  },
  userInfoSection: {
    marginTop: 12,
    width: '100%',
  },
  lightContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -10,
    paddingTop: 120,
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  darkContainer: {
    flex: 1,
    backgroundColor: 'rgba(28, 28, 30, 0.95)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -10,
    paddingTop: 120,
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    marginTop: 20, // Add padding to account for profile picture and user info section
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000000',
    fontFamily: 'NewSpirit-SemiBold',
    width: '100%',
  },
  userLocation: {
    fontSize: 14,
    opacity: 0.7,
    color: '#000000',
    width: '100%',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  tripPlansCard: {
    padding: 20,
    borderRadius: 16,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTripsText: {
    fontSize: 16,
    opacity: 0.6,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  interestText: {
    fontSize: 14,
    fontWeight: '500',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
