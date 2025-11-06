import { Colors } from '@/constants/theme';
import React, { forwardRef } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, useColorScheme } from 'react-native';
import { ThemedText } from './themed-text';

interface ThemedInputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const ThemedInput = forwardRef<TextInput, ThemedInputProps>(
  ({ label, error, icon, style, ...props }, ref) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const backgroundColor = isDark ? '#2C2C2E' : '#F2F2F7';
    const textColor = Colors[colorScheme ?? 'light'].text;
    const placeholderColor = isDark ? '#8E8E93' : '#8E8E93';
    const borderColor = error
      ? '#FF3B30'
      : isDark
        ? '#3A3A3C'
        : '#E5E5EA';

    return (
      <View style={styles.container}>
        {label && (
          <ThemedText style={styles.label}>{label}</ThemedText>
        )}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor,
              borderColor,
              borderWidth: error ? 1 : 0,
            },
          ]}
        >
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <TextInput
            ref={ref}
            style={[
              styles.input,
              { color: textColor },
              icon && styles.inputWithIcon,
              style,
            ]}
            placeholderTextColor={placeholderColor}
            {...props}
          />
        </View>
        {error && (
          <ThemedText style={styles.error}>{error}</ThemedText>
        )}
      </View>
    );
  }
);

ThemedInput.displayName = 'ThemedInput';

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  inputWithIcon: {
    paddingVertical: 14,
  },
  error: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 6,
  },
});

