import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getProductById, insertCartItem, deleteProduct } from '../../database/databaseService';
import { useAuth } from '../../context/AuthContext';

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // useLocalSearchParams returns an object with the route params
  // e.g., { id: '3' }
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch product details by ID
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return; // In case id is undefined
      setLoading(true);
      try {
        const productId = parseInt(id, 10);
        const fetchedProduct = await getProductById(productId);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error('Error fetching product by ID:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await insertCartItem(product.id, 1);
      Alert.alert('Success', 'Product added to cart.');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Could not add product to cart.');
    }
  };

  const handleRemoveProduct = async () => {
    if (!product) return;
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
              router.push('/'); // Go back to Home
            } catch (error) {
              console.error('Error removing product:', error);
              Alert.alert('Error', 'Could not remove product.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize: 16 }}>Product not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>${product.price?.toFixed(2)}</Text>
      <Text style={styles.description}>{product.description}</Text>

      {/* Buyer sees an "Add to Cart" button */}
      {user?.role === 'buyer' && (
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      )}

      {/* Seller sees a "Remove Product" button if they posted it */}
      {user?.role === 'seller' && user.id === product.seller_id && (
        <TouchableOpacity style={styles.removeButton} onPress={handleRemoveProduct}>
          <Text style={styles.buttonText}>Remove Product</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: '#555',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
