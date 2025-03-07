// components/CartButton.tsx
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getCartItems } from '../database/databaseService';

export default function CartButton() {
  const [cartCount, setCartCount] = useState<number>(0);
  const router = useRouter();

  // Fetch the cart items to calculate the total quantity
  const fetchCartCount = async () => {
    try {
      const items = await getCartItems();
      // Sum up the quantities of all cart items
      const count = items.reduce((total: number, item: any) => total + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  // Fetch the count when the component mounts. 
  // In a full app, you might want to refresh the count on navigation or via a subscription.
  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <TouchableOpacity style={styles.button} onPress={() => router.push('/cart')}>
      <Text style={styles.buttonText}>Cart</Text>
      {cartCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{cartCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  badge: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: 'absolute',
    top: -5,
    right: -5,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
  },
});
