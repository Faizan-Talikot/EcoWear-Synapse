import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';

const dummyProducts = [
  {
    id: '1',
    name: 'Organic Cotton T-Shirt',
    brand: 'EcoWear',
    price: 799,
    score: 92,
    isPaid: true,
    imageUrl: require('../Assets/pro1.webp'),
  },
  {
    id: '2',
    name: 'Recycled Jeans',
    brand: 'GreenDenim',
    price: 1499,
    score: 88,
    isPaid: false,
    imageUrl: require('../Assets/pro3.webp'),
  },
  {
    id: '3',
    name: 'Sustainable Hoodie',
    brand: 'EarthStyle',
    price: 1899,
    score: 90,
    isPaid: true,
    imageUrl: require('../Assets/pro4.webp'),
  },
  {
    id: '4',
    name: 'Bamboo Sunglasses',
    brand: 'NatureShades',
    price: 999,
    score: 85,
    isPaid: false,
    imageUrl: require('../Assets/pro5.webp'),
  },
  {
    id: '5',
    name: 'Eco Canvas Tote',
    brand: 'GreenGoods',
    price: 499,
    score: 89,
    isPaid: false,
    imageUrl: 'https://images.unsplash.com/photo-1618354691319-980746940869',
  },
];

const sortedProducts = [
  ...dummyProducts.filter(p => p.isPaid),
  ...dummyProducts.filter(p => !p.isPaid),
];

const CatalogScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.isPaid && <Text style={styles.adTag}>Ad</Text>}
      <Image source={item.imageUrl } style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.brand}>{item.brand}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
      <Text style={styles.score}>Eco Score: {item.score}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Eco-Friendly Products</Text>
      <FlatList
        data={sortedProducts}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
    color: '#333',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    position: 'relative',
  },
  adTag: {
    position: 'absolute',
    top: 10,
    right: 10,
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
    height: 400,
    resizeMode: 'cover',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
  button: {
    marginTop: 10,
    backgroundColor: '#228B22',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default CatalogScreen;
