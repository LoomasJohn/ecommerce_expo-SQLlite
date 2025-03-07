import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getProducts } from '../database/databaseService';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

export default function HomeScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Pass optional search and category parameters to getProducts
      const productList = await getProducts(searchQuery, categoryFilter);
      setProducts(productList);
    } catch (error) {
      console.warn('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, categoryFilter]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Add the header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>UNG Tech</Text>
      </View>

      <View style={{ flex: 1, padding: 20 }}>
        {user ? (
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
            Hello, {user.name}!
          </Text>
        ) : (
          <Text style={{ fontSize: 16, marginBottom: 10 }}>You are not logged in.</Text>
        )}

        {/* Search Bar and Category Filter */}
        <View style={styles.filterContainer}>
          <TextInput
            style={styles.filterInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TextInput
            style={styles.filterInput}
            placeholder="Category..."
            value={categoryFilter}
            onChangeText={setCategoryFilter}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
          {user ? (
            <>
              {user.role === 'seller' ? (
                <TouchableOpacity
                  style={{ backgroundColor: '#6c757d', padding: 10, borderRadius: 5 }}
                  onPress={() => router.push('/sell')}
                >
                  <Text style={{ color: 'white', fontSize: 16 }}>Sell</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{ backgroundColor: '#28a745', padding: 10, borderRadius: 5 }}
                  onPress={() => router.push('/cart')}
                >
                  <Text style={{ color: 'white', fontSize: 16 }}>Cart</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={{ backgroundColor: '#007bff', padding: 10, borderRadius: 5 }}
                onPress={() => router.push('/profile')}
              >
                <Text style={{ color: 'white', fontSize: 16 }}>Profile</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={{ backgroundColor: '#007bff', padding: 10, borderRadius: 5 }}
                onPress={() => router.push('/signin')}
              >
                <Text style={{ color: 'white', fontSize: 16 }}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: '#28a745', padding: 10, borderRadius: 5 }}
                onPress={() => router.push('/signup')}
              >
                <Text style={{ color: 'white', fontSize: 16 }}>Sign Up</Text>
              </TouchableOpacity>
            </>
          )}
          {user && (
            <TouchableOpacity
              style={{ backgroundColor: '#dc3545', padding: 10, borderRadius: 5 }}
              onPress={() => signOut()}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Sign Out</Text>
            </TouchableOpacity>
          )}
        </View>

        {products.length === 0 ? (
          <Text style={{ textAlign: 'center', fontSize: 16 }}>No products available</Text>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => router.push(`../product/${item.id}`)}>
                <ProductCard product={item} refreshProducts={fetchProducts} />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#002f87',
    paddingVertical: 12,
    marginBottom: 16,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  filterInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
});