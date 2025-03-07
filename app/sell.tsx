// app/sell.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { insertProduct } from '../database/databaseService';

export default function SellScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); // New category input

  const handleSell = async () => {
    if (!name || !price || !image || !description || !category) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }
    if (!user || user.role !== 'seller') {
      Alert.alert('Error', 'Only sellers can post products.');
      return;
    }
    try {
      await insertProduct(user.id, name, parseFloat(price), image, description, category);
      Alert.alert('Success', 'Product posted successfully!');
      router.push('/'); // Go back to Home
    } catch (error) {
      console.error('Error posting product:', error);
      Alert.alert('Error', 'An error occurred while posting the product.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post a Product</Text>
      <TextInput
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />
      <Button title="Post Product" onPress={handleSell} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 12,
    padding: 8,
  },
});
