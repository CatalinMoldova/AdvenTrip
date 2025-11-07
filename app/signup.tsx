import { AuthScreenWrapper } from '@/components/auth-screen-wrapper';
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, View, useColorScheme } from 'react-native';


const SignUp = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // Here you'll add your signup logic
    if (!password.trim() || !email.trim() || !name.trim()) {
      Alert.alert('Sign up Error', 'Please fill in all fields');
      return;
    }

    let nameCleaned = name.trim();
    let emailCleaned = email.trim();
    let passwordCleaned = password.trim();

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);


    const {data : { session }, error} = await supabase.auth.signUp({
      email: emailCleaned,
      password: passwordCleaned,
      options: {
        data: {
          name: nameCleaned,
        },
      }
    });

    // log the session and error (if there is one)
    // console.log('session: ', session);
    // console.log('error: ', error);

    if (error) {
      Alert.alert('Sign up Error', error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    // Auth state listener in _layout.tsx will handle navigation to onboarding or home
    // console.log('Signing up with:', { name, email, password });


    // Simulate API call
    // setTimeout(() => {
    //   setLoading(false);
    //   router.navigate('/(tabs)');
    // }, 2000);
  };

  return (
    <AuthScreenWrapper>
      <View style={styles.container}>
        {/* <BackButton router={router} /> */}
        
        {/* Welcome text */}
        <ThemedText type="title" style={styles.title}>
          Sign Up
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Create your account to get started
        </ThemedText>

        {/* Sign Up Form */}
        <View style={styles.form}>
          <ThemedInput
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoComplete="name"
            icon={
              <IconSymbol
                name="person.fill"
                size={20}
                color={isDark ? '#8E8E93' : '#8E8E93'}
              />
            }
          />

        {/* <ThemedInput
            label="User Name"
            placeholder="Enter a username"
            value={name}
            onChangeText={setUsername}
            autoComplete="name"
            icon={
              <IconSymbol
                name="person.fill"
                size={20}
                color={isDark ? '#8E8E93' : '#8E8E93'}
              />
            }
          /> */}

          <ThemedInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            icon={
              <IconSymbol
                name="envelope.fill"
                size={20}
                color={isDark ? '#8E8E93' : '#8E8E93'}
              />
            }
          />

          <ThemedInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password-new"
            icon={
              <IconSymbol
                name="lock.fill"
                size={20}
                color={isDark ? '#8E8E93' : '#8E8E93'}
              />
            }
          />

          <ThemedButton
            title="Create Account"
            onPress={handleSignUp}
            loading={loading}
            style={styles.signUpButton}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Already have an account?{' '}
          </ThemedText>
          <Pressable onPress={() => router.replace('/login')}>
            <ThemedText style={styles.loginLink}>Log In</ThemedText>
          </Pressable>
        </View>
      </View>
    </AuthScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 32,
  },
  form: {
    flex: 1,
  },
  signUpButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    opacity: 0.6,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
});