import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ProductCard = ({ product }) => (
  <View style={styles.productCard}>
    <Image source={product.image} style={styles.productImage} />
    <Text style={styles.productTitle}>{product.title}</Text>
  </View>
);

const styles = StyleSheet.create({
  productCard: {
    width: 150,
    alignItems: 'center',
    marginBottom: 20,
    marginRight: 10, 
    marginTop:10
  },
  productImage: {
    width: 150,
    height: 200,
    borderRadius: 10,
  },
  productTitle: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

export default ProductCard;
