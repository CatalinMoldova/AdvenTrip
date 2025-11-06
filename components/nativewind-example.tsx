import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';

/**
 * Example component showing how to use NativeWind
 * You can use this as a reference or delete it once you're familiar with NativeWind
 */
export function NativeWindExample() {
  const [count, setCount] = useState(0);

  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900 p-4">
      {/* Title */}
      <Text className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        NativeWind Example
      </Text>

      {/* Subtitle */}
      <Text className="text-base text-gray-600 dark:text-gray-300 mb-8 text-center">
        This component uses Tailwind CSS classes!
      </Text>

      {/* Counter Display */}
      <View className="bg-blue-500 rounded-2xl px-8 py-4 mb-6">
        <Text className="text-4xl font-bold text-white">{count}</Text>
      </View>

      {/* Buttons Row */}
      <View className="flex-row gap-4">
        {/* Increment Button */}
        <Pressable
          onPress={() => setCount(count + 1)}
          className="bg-green-500 active:bg-green-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold text-lg">+ Add</Text>
        </Pressable>

        {/* Decrement Button */}
        <Pressable
          onPress={() => setCount(count - 1)}
          className="bg-red-500 active:bg-red-600 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold text-lg">- Remove</Text>
        </Pressable>
      </View>

      {/* Reset Button */}
      <Pressable
        onPress={() => setCount(0)}
        className="mt-6 border-2 border-gray-400 dark:border-gray-600 px-6 py-3 rounded-lg"
      >
        <Text className="text-gray-700 dark:text-gray-300 font-semibold">
          Reset
        </Text>
      </Pressable>

      {/* Info Card */}
      <View className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-xl max-w-sm">
        <Text className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
          💡 Try switching between light and dark mode to see the colors adapt!
        </Text>
      </View>
    </View>
  );
}

