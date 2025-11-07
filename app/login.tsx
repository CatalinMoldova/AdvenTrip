import { AuthScreenWrapper } from '@/components/auth-screen-wrapper';
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, useColorScheme, View } from 'react-native';

const Login = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogIn = async () => {
      // here you'll add your log in logic

      // if the email or password is missing, alert the user to try again
      if (!email.trim() || !password.trim()) {
          Alert.alert('Login', 'Please fill all the fields!');
          return;
      }

      let emailCleaned = email.trim();
      let passwordCleaned = password.trim();

      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const { error } = await supabase.auth.signInWithPassword({
        email: emailCleaned,
        password: passwordCleaned,
      });

      console.log('error: ', error);

      if (error) {
        Alert.alert('Login', error.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      router.replace('/(tabs)');



      // console.log('Signing in with:', {email, password});

      // simulate API call
      // setTimeout(() => {
      //   setLoading(false);
      //   router.navigate('/(tabs)');
      // }, 2000); 
    };


  return (
    <AuthScreenWrapper>
      <View style={styles.container}>
        {/* <BackButton router={router}/> */}
        <ThemedText type="title" style={styles.title}>
          Welcome Back
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Sign in to continue your adventure
        </ThemedText>
        
        {/* Your login form will go here */}
        <View style={styles.form}>
            <ThemedInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                icon={<IconSymbol name="envelope.fill" size={20} color={isDark ? '#8E8E93' : '#8E8E93'} />}
                
            />
            <ThemedInput 
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
              icon={<IconSymbol name="lock.fill" size={20} color={isDark ? '#8e8e93' : '#8e8e93'} />}
            />

            <ThemedButton title="Log In" onPress={handleLogIn} loading={loading} style={styles.loginButton}/>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Don't have an account? {' '}
          </ThemedText>
          <Pressable onPress={() => router.replace('/signup')}>
            <ThemedText style={styles.signUpLink}>Sign Up</ThemedText>
          </Pressable>
        </View>
      </View>
    </AuthScreenWrapper>
  );
};

export default Login;

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
  loginButton: {
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
  signUpLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
});