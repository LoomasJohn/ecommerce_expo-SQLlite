// app/profile.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../database/databaseService';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut, signIn } = useAuth();
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>You are not logged in.</Text>
        <Button title="Sign In" onPress={() => router.push('/signin')} />
      </View>
    );
  }

  const handleUpdateProfile = async () => {
    try {
      await updateUserProfile(user.id, name, email);
      Alert.alert('Success', 'Profile updated successfully.');
      // Update the Auth Context with the new details
      signIn({ ...user, name, email });
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Could not update profile.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <Button title="Update Profile" onPress={handleUpdateProfile} />
      
      <View style={{ marginVertical: 10 }} />
      
      <Button title="Sign Out" onPress={() => signOut()} color="#dc3545" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center'
  },
  label: {
    fontSize: 16,
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 12,
    padding: 8
  }
});
