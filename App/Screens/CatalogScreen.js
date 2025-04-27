import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Heart } from 'react-native-feather'; // For like button
import { BASE_URL } from '../../env';

const CatalogScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current; // For card animation

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/items`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error('Invalid response: Expected array');
        setProducts(data);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } catch (err) {
        console.error('Fetch error:', err.message);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ItemDetail', {
          itemId: item.id,
          category: item.category,
        })
      }
    >
      {item.isPaid && <Text style={styles.adTag}>Ad</Text>}
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        resizeMode="cover"
        onError={() => console.warn(`Failed to load image: ${item.imageUrl}`)}
      />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
        <Text style={styles.score}>Eco Score: {item.score}</Text>
      </View>
      <TouchableOpacity style={styles.likeButton}>
        <Heart width={20} height={20} stroke="#E91E63" fill="none" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a8c37" />
        <Text style={styles.feedbackText}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            setError(null);
            fetchProducts();
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Eco-Friendly Products</Text>
      <Animated.View style={[styles.listContainer, { opacity: fadeAnim }]}>
        <FlatList
          data={products}
          keyExtractor={(item) => `${item.category}-${item.id}`}
          renderItem={({ item, index }) => {
            if (index % 2 === 0 && index < products.length - 1) {
              return (
                <View style={styles.rowContainer}>
                  {renderItem({ item })}
                  {renderItem({ item: products[index + 1] })}
                </View>
              );
            } else if (index % 2 === 0 && index === products.length - 1) {
              return (
                <View style={styles.rowContainer}>
                  {renderItem({ item })}
                </View>
              );
            }
            return null;
          }}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    paddingTop: StatusBar.currentHeight || 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
    color: '#333',
  },
  listContainer: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    width: '48%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  adTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFD700',
    color: '#333',
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  brand: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a8c37',
    marginBottom: 4,
  },
  score: {
    fontSize: 14,
    color: '#228B22',
    fontWeight: '500',
  },
  likeButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  feedbackText: {
    marginTop: 8,
    fontSize: 16,
    color: '#1a8c37',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#1a8c37',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CatalogScreen;