import { AuthScreenWrapper } from '@/components/auth-screen-wrapper';
import BackButton from '@/components/BackButton';
import { ThemedButton } from '@/components/themed-button';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, useColorScheme, View } from 'react-native';

const Login = () => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogIn = async () => {
      // here you'll add your log in logic

      // if the email or password is missing, alert the user to try again
      if (!username.trim() || !password.trim()) {
          Alert.alert('Login', 'Please fill all the fields!');
          return;
      }
      // good to go
      setLoading(true);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      console.log('Signing in with:', {username, password});

      // simulate API call
      setTimeout(() => {
        setLoading(false);
        router.navigate('/(tabs)');
      }, 2000); 
    };


  return (
    <AuthScreenWrapper>
      <View style={styles.container}>
        <BackButton router={router}/>
        <ThemedText type="title" style={styles.title}>
          Welcome Back
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Sign in to continue your adventure
        </ThemedText>
        
        {/* Your login form will go here */}
        <View style={styles.form}>
            <ThemedInput
                label="Email or Username"
                placeholder="Enter your email or username"
                value={username}
                onChangeText={setUsername}
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
          <Pressable onPress={() => router.push('/signup')}>
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