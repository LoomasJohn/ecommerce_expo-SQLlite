// components/ProductCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { insertCartItem, deleteProduct } from '../database/databaseService';

type Product = {
  id: number;
  seller_id: number;
  name: string;
  price: number;
  image: string;
  description: string;
};

type ProductCardProps = {
  product: Product;
  refreshProducts: () => void; // Callback to refresh product list after removal
};

export default function ProductCard({ product, refreshProducts }: ProductCardProps) {
  const { user } = useAuth();

  const handleAddToCart = async () => {
    try {
      await insertCartItem(product.id, 1);
      Alert.alert('Success', 'Product added to cart.');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      Alert.alert('Error', 'Could not add product to cart.');
    }
  };

  const handleRemoveProduct = async () => {
    Alert.alert(
      'Confirm Removal',
      'Are you sure you want to remove this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProduct(product.id);
              Alert.alert('Success', 'Product removed.');
              refreshProducts();
            } catch (error) {
              console.error('Error removing product:', error);
              Alert.alert('Error', 'Could not remove product.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <Text style={styles.description}>{product.description}</Text>

      {/* Buyer: Add to Cart */}
      {user && user.role === 'buyer' && (
        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      )}

      {/* Seller: Remove Product (only if they posted it) */}
      {user && user.role === 'seller' && user.id === product.seller_id && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#dc3545' }]}
          onPress={handleRemoveProduct}
        >
          <Text style={styles.buttonText}>Remove Product</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  price: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  description: {
    marginTop: 6,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
