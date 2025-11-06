import { AuthScreenWrapper } from '@/components/auth-screen-wrapper';
import BackButton from '@/components/BackButton';
import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const Login = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');

  return (
    <AuthScreenWrapper>
      <View style={styles.container}>
        <BackButton router={router} />
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
                
            >

            </ThemedInput>
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
  }
});