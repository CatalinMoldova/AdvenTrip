import { useColorScheme } from '@/hooks/use-color-scheme';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <NativeTabs>
      {/* // screenOptions={{
      //   tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tabIconSelected,
      //   tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
      //   headerShown: false,
      //   tabBarButton: HapticTab,
      // }}> */}
        <NativeTabs.Trigger name="index">
          <Label>Feed</Label>
          <Icon sf={{ default: 'square.stack', selected: 'square.stack.fill' }} drawable="home_drawable" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="adventures">
          <Label>Trip Planner</Label>
          <Icon sf="safari" drawable="ic_menu_mylocation" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Label>Profile</Label>
          <Icon sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }} drawable="ic_menu_mylocation" />
        </NativeTabs.Trigger>
      {/* <NativeTabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={focused ? "house.fill" : "house"} 
              color={color} 
            />
          ),
        }}
      />
      <NativeTabs.Screen
        name="adventures"
        options={{
          title: 'Trip Planner',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={focused ? "clipboard.fill" : "clipboard"} 
              color={color} 
            />
          ),
        }}
      />
      <NativeTabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol 
              size={28} 
              name={focused ? "person.crop.circle.fill" : "person.crop.circle"} 
              color={color} 
            />
          ),
        }}
      />
      <NativeTabs.Screen
        name="settings"
        options={{
          href: null, // Hide from tab bar but keep accessible via navigation
        }}
      /> */}
    </NativeTabs>
  );
}
