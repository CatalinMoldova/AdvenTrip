import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText } from './themed-text';

interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function ThemedButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: ThemedButtonProps) {
  const getButtonStyle = (pressed: boolean) => {
    const baseStyle = [styles.button, style];

    if (variant === 'primary') {
      return [
        ...baseStyle,
        styles.primaryButton,
        pressed && styles.primaryButtonPressed,
        (disabled || loading) && styles.buttonDisabled,
      ];
    }

    if (variant === 'secondary') {
      return [
        ...baseStyle,
        styles.secondaryButton,
        pressed && styles.secondaryButtonPressed,
        (disabled || loading) && styles.buttonDisabled,
      ];
    }

    if (variant === 'outline') {
      return [
        ...baseStyle,
        styles.outlineButton,
        pressed && styles.outlineButtonPressed,
        (disabled || loading) && styles.buttonDisabled,
      ];
    }

    return baseStyle;
  };

  const getTextColor = () => {
    if (variant === 'primary') return '#fff';
    if (variant === 'outline') return '#000';
    return '#000';
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => getButtonStyle(pressed)}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <ThemedText style={[styles.buttonText, { color: getTextColor() }]}>
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  primaryButton: {
    backgroundColor: '#000',
  },
  primaryButtonPressed: {
    backgroundColor: '#333',
  },
  secondaryButton: {
    backgroundColor: '#F2F2F7',
  },
  secondaryButtonPressed: {
    backgroundColor: '#E5E5EA',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#000',
  },
  outlineButtonPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

