# NativeWind Usage Examples

NativeWind has been successfully installed! Here's how to use Tailwind CSS classes in your React Native components.

## Basic Usage

### 1. Using className prop

```tsx
import { View, Text } from 'react-native';

export default function Example() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-blue-500">
        Hello NativeWind!
      </Text>
    </View>
  );
}
```

### 2. Conditional Classes

```tsx
import { Text, Pressable } from 'react-native';
import { useState } from 'react';

export default function Button() {
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <Pressable
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      className={`px-6 py-4 rounded-lg ${
        isPressed ? 'bg-blue-600' : 'bg-blue-500'
      }`}
    >
      <Text className="text-white font-semibold text-center">
        Press Me
      </Text>
    </Pressable>
  );
}
```

### 3. Dark Mode Support

```tsx
import { View, Text } from 'react-native';

export default function DarkModeExample() {
  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Text className="text-black dark:text-white text-xl">
        This adapts to dark mode!
      </Text>
    </View>
  );
}
```

### 4. Responsive Design

```tsx
import { View, Text } from 'react-native';

export default function ResponsiveExample() {
  return (
    <View className="p-4 sm:p-6 md:p-8">
      <Text className="text-base sm:text-lg md:text-xl">
        Responsive Text
      </Text>
    </View>
  );
}
```

### 5. Flexbox & Layout

```tsx
import { View, Text } from 'react-native';

export default function LayoutExample() {
  return (
    <View className="flex-1 flex-row justify-between items-center px-4">
      <View className="w-20 h-20 bg-red-500 rounded-full" />
      <View className="w-20 h-20 bg-blue-500 rounded-lg" />
      <View className="w-20 h-20 bg-green-500" />
    </View>
  );
}
```

### 6. Custom Styles with Arbitrary Values

```tsx
import { View } from 'react-native';

export default function ArbitraryValues() {
  return (
    <View className="bg-[#fcba03] p-[17px] rounded-[32px]">
      {/* Custom values */}
    </View>
  );
}
```

## Converting Your Existing Components

### Before (StyleSheet):
```tsx
import { View, Text, StyleSheet } from 'react-native';

export default function OldWay() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});
```

### After (NativeWind):
```tsx
import { View, Text } from 'react-native';

export default function NewWay() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold text-black">Hello</Text>
    </View>
  );
}
```

## Tailwind Class Reference (Common)

### Spacing
- `p-4` = padding: 16px
- `px-4` = horizontal padding
- `py-4` = vertical padding
- `m-4` = margin: 16px
- `gap-4` = gap: 16px

### Sizing
- `w-20` = width: 80px
- `h-20` = height: 80px
- `w-full` = width: 100%
- `min-h-screen` = min-height: 100vh

### Flexbox
- `flex-1` = flex: 1
- `flex-row` = flexDirection: 'row'
- `justify-center` = justifyContent: 'center'
- `items-center` = alignItems: 'center'
- `self-start` = alignSelf: 'flex-start'

### Typography
- `text-xs` = fontSize: 12px
- `text-sm` = fontSize: 14px
- `text-base` = fontSize: 16px
- `text-lg` = fontSize: 18px
- `text-xl` = fontSize: 20px
- `text-2xl` = fontSize: 24px
- `font-bold` = fontWeight: 'bold'
- `text-center` = textAlign: 'center'

### Colors
- `bg-blue-500` = backgroundColor
- `text-red-500` = color
- `border-gray-300` = borderColor

### Border & Radius
- `rounded` = borderRadius: 4px
- `rounded-lg` = borderRadius: 8px
- `rounded-full` = borderRadius: 9999px
- `border` = borderWidth: 1px
- `border-2` = borderWidth: 2px

### Opacity
- `opacity-50` = opacity: 0.5
- `opacity-75` = opacity: 0.75

## Next Steps

1. Start converting your components one by one
2. You can mix NativeWind with StyleSheet if needed
3. Check out the full docs: https://www.nativewind.dev/

## Tips

- Use `className` instead of `style` for Tailwind classes
- You can still use `style` prop for dynamic styles
- NativeWind works with all React Native components
- Use the Tailwind CSS IntelliSense VSCode extension for autocomplete

