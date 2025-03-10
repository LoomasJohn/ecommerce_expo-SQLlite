// app/cart.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { getCartItems, deleteCartItem, updateCartItem } from '../database/databaseService';

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const items = await getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      Alert.alert('Error', 'An error occurred while fetching cart items.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await deleteCartItem(cartItemId);
      Alert.alert('Success', 'Item removed from cart.');
      fetchCartItems();
    } catch (error) {
      console.error('Error removing cart item:', error);
      Alert.alert('Error', 'An error occurred while removing the item.');
    }
  };

  const handleIncrement = async (item: any) => {
    const newQuantity = item.quantity + 1;
    try {
      await updateCartItem(item.id, newQuantity);
      fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Could not update quantity.');
    }
  };

  const handleDecrement = async (item: any) => {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      try {
        await updateCartItem(item.id, newQuantity);
        fetchCartItems();
      } catch (error) {
        console.error('Error updating quantity:', error);
        Alert.alert('Error', 'Could not update quantity.');
      }
    } else {
      Alert.alert('Minimum Quantity', 'Quantity cannot be less than 1.');
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading cart...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>
                  ${item.price.toFixed(2)} x {item.quantity}
                </Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity style={styles.qtyButton} onPress={() => handleDecrement(item)}>
                    <Text style={styles.qtyButtonText}>–</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.qtyButton} onPress={() => handleIncrement(item)}>
                    <Text style={styles.qtyButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(item.id)}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <Text style={styles.total}>Total: ${totalPrice.toFixed(2)}</Text>
      <Button title="Checkout" onPress={() => Alert.alert('Checkout', 'Checkout not implemented yet.')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  emptyText: { textAlign: 'center', fontSize: 16, marginTop: 20 },
  itemContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: { fontSize: 16 },
  itemPrice: { fontSize: 16, marginTop: 4 },
  removeButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 4,
    marginLeft: 10,
  },
  removeButtonText: { color: 'white' },
  total: { fontSize: 20, textAlign: 'center', marginVertical: 16 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  qtyButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 4,
    borderRadius: 4,
  },
  qtyButtonText: { fontSize: 16 },
  qtyText: { marginHorizontal: 8, fontSize: 16 },
});
