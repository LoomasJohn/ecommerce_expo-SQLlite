// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from 'react-native';

import { setupDatabase } from '../database/database';
import { insertProduct, getProducts, insertUser } from '../database/databaseService';
import { AuthProvider } from '../context/AuthContext';
import CartButton from '../components/CartButton'; // Import the CartButton

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Database initialization
  useEffect(() => {
    const initializeDatabase = async () => {
      await setupDatabase();

      console.warn('Attempting to insert test product...');
      // Insert a test seller
      await insertUser('Test Seller', 'seller@example.com', 'password123', 'seller');

      // Insert a test product
      await insertProduct(
        1, // Make sure this seller exists!
        'Test Product',
        9.99,
        'https://example.com/test.jpg',
        'This is a test product',
        'Test Category'
      );
      console.warn('Finished insertProduct function');

      // Fetch and log products
      const products = await getProducts();
      console.warn('Products:', products);
    };

    initializeDatabase();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack>
          {/* Main app tabs screen with a header that includes the CartButton */}
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: true,
              headerTitle: 'Home',
              headerRight: () => <CartButton />,
            }}
          />

          {/* Authentication Screens */}
          <Stack.Screen name="../signin" options={{ title: 'Sign In' }} />
          <Stack.Screen name="../signup" options={{ title: 'Sign Up' }} />

          {/* Other App Screens */}
          <Stack.Screen name="../components/productDetails" options={{ title: 'Product Details' }} />
          <Stack.Screen name="../app/cart" options={{ title: 'Cart' }} />
          <Stack.Screen name="../app/profile" options={{ title: 'Profile' }} />

          <Stack.Screen name="+not-found" />
        </Stack>
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
