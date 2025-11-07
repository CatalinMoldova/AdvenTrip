import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, Platform, SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, View, useColorScheme } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

const LocationOnboarding = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleContinue = async () => {
    if (!city.trim()) {
      Alert.alert('Location Required', 'Please enter your city to continue');
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Store the city in session storage to pass to next screen
    // We'll update the database after collecting all onboarding info
    try {
      // Navigate to interests screen with city data
      router.push({
        pathname: '/onboarding/interests',
        params: { city: city.trim() }
      });
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.outerContainer}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            {/* Colored Header Section */}
            <View style={styles.headerSection}>
              {/* SVG Background */}
              <View style={styles.svgContainer}>
                <Svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 804 587"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <G>
                    <Path
                      d="M65.361 250.568C92.003 261.558 83.122 299.967 73.353 320.059C69.468 329.272 65.25 332.492 58.367 338.597C53.372 344.369 48.71 355.359 41.05 364.129C38.497 367.459 35.5 371.233 34.723 375.23C33.502 378.671 37.054 383.111 35.389 385.886C29.172 391.215 23.622 398.985 18.182 406.09C16.073 408.532 13.409 412.861 15.518 415.636C18.404 419.855 34.279 404.869 40.495 396.987C58.589 375.674 80.791 343.37 102.437 328.94C110.763 322.834 120.975 316.063 128.191 309.735C131.965 307.293 137.294 305.073 140.402 302.964C143.621 301.077 147.173 297.635 151.28 298.856C163.158 304.407 179.032 297.968 183.806 314.842C187.691 325.609 185.693 337.598 181.808 345.591C178.144 354.138 171.817 357.468 171.04 364.351C171.04 368.902 174.148 371.566 169.819 377.45C161.049 387.44 159.606 395.988 156.72 408.31C150.281 427.736 135.184 448.051 128.191 465.59C125.86 471.584 125.305 475.58 127.303 475.691C144.176 465.257 160.494 438.948 175.48 427.181C197.904 410.308 225.989 379.226 252.297 364.24C255.406 362.575 256.849 360.91 257.737 357.579C262.843 351.474 276.275 350.142 283.601 348.588C291.372 347.145 297.588 351.141 304.582 351.363C320.9 345.924 319.235 369.124 318.569 379.337C318.791 393.102 310.798 406.201 302.584 415.858C297.588 423.629 292.926 428.957 286.71 435.285C282.047 439.281 278.939 449.272 275.831 454.6C269.059 466.034 263.398 478.8 281.27 464.48C309.355 440.391 332.889 409.642 364.415 389.772C388.17 365.128 416.81 341.594 444.784 322.723C450.002 319.726 475.755 299.634 479.308 310.623C480.529 314.731 479.641 315.841 483.526 316.729C498.512 319.615 517.716 322.612 508.725 344.259C501.398 357.801 488.299 364.018 480.751 377.894C479.308 380.225 477.643 382.334 475.866 384.332C460.214 400.65 458.549 430.4 441.454 446.94C430.575 454.156 427.356 465.146 421.029 475.913C419.475 479.466 409.373 488.457 410.816 493.12C420.252 495.007 431.796 479.799 439.789 472.694C455.774 454.489 478.975 433.509 498.068 422.519C505.727 415.525 516.051 413.194 522.601 405.868C525.376 400.539 531.148 400.428 535.7 397.653C536.699 396.543 537.032 394.545 537.587 393.102C538.919 387.107 547.133 386.552 551.463 383.222C558.789 377.561 564.228 371.788 572.443 367.459C582.66 361.021 595.75 349.809 609.52 350.475C615.18 351.807 616.85 354.582 622.17 355.47C626.39 356.58 633.61 355.581 638.6 356.691C641.05 356.913 647.6 359.578 650.7 361.354C654.7 363.574 664.58 368.569 665.25 374.453C666.13 387.218 648.15 394.323 642.38 403.093C640.82 405.202 636.61 411.64 636.38 413.083C624.28 440.058 601.86 462.149 589.65 490.344C587.98 494.119 587.54 495.895 588.98 495.562C600.19 488.013 612.74 473.36 624.28 464.813C655.03 438.948 675.79 422.63 704.76 399.207C730.52 374.786 766.71 344.814 805.78 352.251C826.21 353.472 832.64 376.784 825.54 393.324C821.65 403.759 813 412.084 808.78 421.742C803.23 436.506 794.68 453.934 788.8 474.914C775.81 518.54 807.33 480.909 819.77 473.582C853.74 446.385 887.59 420.632 922.34 394.656C928.67 390.327 934.99 391.326 942.88 388.217C948.87 385.553 954.97 378.56 960.75 374.453C973.62 366.127 990.16 359.8 1002.26 351.474C1008.48 346.59 1014.36 339.263 1022.25 337.931C1024.24 337.82 1025.69 338.819 1027.46 339.263C1030.24 340.04 1030.57 339.263 1031.68 338.486C1033.46 337.265 1034.35 334.157 1035.46 332.27C1043 324.943 1052.88 326.164 1061.21 319.393C1071.53 310.401 1085.52 307.071 1097.29 300.744C1099.06 299.523 1099.06 299.3 1102.06 297.191C1107.28 294.416 1109.61 290.642 1113.16 288.089C1116.82 286.313 1122.6 283.093 1125.93 281.65C1132.7 278.209 1138.8 273.214 1146.24 272.77C1153.57 273.103 1160.67 273.103 1166.67 267.774C1171.77 263.889 1174.1 261.003 1180.32 262.557C1192.97 268.884 1170.77 285.758 1162 295.637C1149.24 307.182 1134.03 314.953 1119.27 324.166C1056.1 366.571 975.73 420.743 928.22 454.045C917.23 463.592 907.02 472.139 897.69 482.463C892.48 491.232 887.59 487.902 880.04 491.121C869.72 498.004 861.17 511.88 848.96 514.877C836.31 519.206 825.87 526.311 820.43 538.411C816.1 549.4 811.78 557.171 799.79 561.056C778.14 570.603 726.52 579.816 717.42 572.157C715.98 571.269 715.2 570.27 715.31 569.382C716.97 565.94 723.08 567.162 726.85 566.718C739.07 567.384 763.15 565.94 767.82 560.168C774.81 547.846 740.95 547.069 734.85 547.069C728.08 546.403 718.75 551.398 712.53 547.069C697.99 526.866 716.64 502.333 724.97 484.128C727.63 479.244 729.63 474.914 731.74 469.919C733.07 466.145 737.73 458.707 732.07 457.375C714.98 459.706 698.33 480.354 684.34 491.565C651.7 524.091 621.51 541.186 589.87 567.828C576.328 579.039 559.566 585.034 546.578 597.023C541.028 603.905 538.475 607.346 534.034 612.453C532.813 614.118 532.147 614.229 530.926 617.004C530.149 619.89 531.703 626.551 526.819 625.33C513.831 619.89 498.956 621.999 489.187 611.01C484.192 605.57 477.865 609.677 474.756 606.347C467.874 566.718 516.717 508.772 541.583 471.029C553.017 454.933 560.01 443.943 556.458 443.61C553.017 443.499 544.247 452.047 540.029 455.932C511.944 483.906 472.869 516.653 438.568 546.514C412.37 571.602 381.399 602.906 352.093 620.778C337.329 630.214 324.008 636.43 313.018 648.863C302.251 660.075 288.819 656.079 276.83 648.308C237.422 625.774 359.198 480.243 376.848 448.717C379.29 445.497 382.62 441.279 385.062 438.282C386.505 436.506 387.282 435.618 386.394 436.062C316.793 485.571 258.07 558.503 193.907 613.341C184.139 622.221 174.259 630.991 162.936 639.428C150.059 648.308 133.408 653.858 119.421 660.963C115.203 663.516 113.538 667.401 111.54 670.954C110.097 673.285 109.875 674.728 107.432 676.726C106.766 677.17 105.989 677.059 105.323 676.504C100.439 669.844 105.989 661.518 106.989 654.635C106.211 616.116 135.295 576.153 166.488 533.748C252.852 412.75 101.771 596.246 73.908 608.012C66.804 613.452 58.922 617.67 52.817 623.109C44.935 630.214 40.717 644.09 30.504 644.978C24.399 645.422 21.402 643.424 16.184 643.424C9.30196 643.091 -2.90904 648.53 -5.90604 641.87C-17.451 616.005 88.117 442.722 121.642 383.111C128.857 370.9 123.64 373.453 114.87 381.557C41.605 445.275 -8.57 531.861 -73.843 595.913C-83.722 604.46 -90.272 622.221 -101.595 627.439C-155.766 650.084 -119.134 587.476 -109.476 565.829C-71.734 495.007 -23.556 426.848 11.633 353.805C45.379 290.864 -107.034 458.596 -123.685 468.698C-148.44 490.677 -165.757 518.207 -189.624 541.186C-202.278 552.953 -254.674 610.677 -263 598.355C-263.111 576.375 -243.351 558.947 -231.362 541.075C-192.51 497.338 -145.887 448.606 -111.474 403.314C-86.72 379.448 -63.297 355.137 -38.875 329.717C-21.447 312.288 -2.24303 296.858 9.74597 279.652C19.071 269.994 30.504 263.667 41.716 256.785C52.151 251.456 57.479 246.905 65.139 250.013L65.361 250.568Z"
                      fill="white"
                      fillOpacity="0.4"
                    />
                  </G>
                </Svg>
              </View>

              {/* Progress indicator */}
              {/* <View style={styles.progressContainer}>
                <View style={[styles.progressDot, styles.progressDotActive]} />
                <View style={styles.progressDot} />
              </View> */}

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>
                  Where are you from?
                </Text>
                <Text style={styles.subtitle}>
                  Let us know your city to help personalize your experience
                </Text>
              </View>
            </View>

            {/* White Form Container */}
            <View style={isDark ? styles.darkContainer : styles.lightContainer}>
              <View style={styles.form}>
                <ThemedInput
                  label="City"
                  placeholder="Enter your city"
                  value={city}
                  onChangeText={setCity}
                  autoCapitalize="words"
                  autoComplete="off"
                  icon={
                    <IconSymbol
                      name="mappin.circle.fill"
                      size={20}
                      color="#8E8E93"
                    />
                  }
                />
              </View>

              {/* Absolutely positioned button */}
              <View style={[styles.buttonContainer, { bottom: keyboardHeight > 0 ? keyboardHeight + 20 : 50 }]}>
                <ThemedButton
                  title="Continue"
                  onPress={handleContinue}
                  loading={loading}
                  style={styles.continueButton}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LocationOnboarding;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F6CB98',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F6CB98',
  },
  container: {
    flex: 1,
  },
  headerSection: {
    backgroundColor: '#F6CB98',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
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
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  progressDotActive: {
    backgroundColor: '#007AFF',
    width: 24,
  },
  header: {
    marginBottom: 0,
    position: 'relative',
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 40,
    color: '#000000',
    fontFamily: 'NewSpirit-SemiBold',
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
    opacity: 0.7,
    lineHeight: 24,
  },
  lightContainer: {
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 20,
    marginTop: -10,
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
    height: '80%',
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    backdropFilter: 'blur(20px)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 20,
    marginTop: -10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  form: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
  continueButton: {
    width: '100%',
  },
});

