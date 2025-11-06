import { Colors } from '@/constants/theme';
import React from 'react';
import { Pressable, StyleSheet, useColorScheme } from 'react-native';
import { IconSymbol } from './ui/icon-symbol';

const BackButton = ({size=28, router}) => {
    const colorScheme = useColorScheme();
    const iconColor = Colors[colorScheme ?? 'light'].text;
    
    return (
        <Pressable onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol size={size} name="chevron.left" color={iconColor} />
        </Pressable>
  )
}

export default BackButton

const styles = StyleSheet.create({
    backButton: {
        alignSelf: 'flex-start',
        padding: 8,
        marginLeft: -8,
        marginBottom: 20,
        borderRadius: 100,
        backgroundColor: 'rgba(0,0,0,0.5)'
      },
})