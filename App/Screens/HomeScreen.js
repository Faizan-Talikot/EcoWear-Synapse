import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import ProductCard from '../../Components/ProductCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BlogCard from '../../Components/BlogCard';
import blogs from '../../Components/blogs.json'
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const categories = [
    { name: 'Shirts', image: require('../Assets/polo-shirt.png') },
    { name: 'TShirts', image: require('../Assets/t-shirt.png') },
    { name: 'Jeans', image: require('../Assets/trousers.png') },
    { name: 'Hoodies', image: require('../Assets/hoodie.png') },
    { name: 'Dresses', image: require('../Assets/dress.png') },
  ];

  // Sample product data
  const products = [
    { id: 1, image: require('../Assets/pro1.webp'), title: 'Cotton Milk Knit Shirt' },
    { id: 2, image: require('../Assets/pro3.webp'), title: 'Olive Airy Shirt' },
    { id: 3, image: require('../Assets/pro4.webp'), title: 'Manoor Black Organic Cotton Dress' },
    { id: 4, image: require('../Assets/pro5.webp'), title: 'Aara Green Print Dress' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Categories */}
          <View style={styles.categories}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryCircle}
                onPress={() => {
                  if (category.name === 'Jeans') {
                    navigation.navigate('Jeans');
                  } else if (category.name === 'Shirts') {
                    navigation.navigate('Shirts');
                  } else if (category.name === 'TShirts') {
                    navigation.navigate('TShirts');
                  } else if (category.name === 'Hoodies') {
                    navigation.navigate('Hoodies');
                  } else if (category.name === 'Dresses') {
                    navigation.navigate('Dresses');
                  }
                }}
              >
                <LinearGradient colors={['#34443D', '#67775E']} style={styles.categoryCircle}>
                  <Image source={category.image} style={styles.categoryImage} />
                  <Text style={styles.categoryText}>{category.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Banner */}
          <LinearGradient colors={['#34443D', '#67775E']} style={styles.banner}>
            <Text style={styles.bannerText}>Be Aware, Choose EcoWear</Text>
          </LinearGradient>

          {/* Sponsored Wardrobe */}
          <Text style={styles.sectionTitle}>Our EcoFriendly Wardrobe</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onPress={() => { }} />
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>EcoWear Blog: Your Fashion Guide</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={blog}
                onPress={() => navigation.navigate('BlogDetails', { blog })}
              />
            ))}
          </ScrollView>
        </ScrollView>

        {/* Floating Action Button for AI Prediction */}
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('MLPrediction')}
        >
          <LinearGradient colors={['#34443D', '#67775E']} style={styles.fabGradient}>
            <Icon name="analytics-outline" size={26} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#6B8E23' },
  container: { flex: 1, backgroundColor: '#F5F5DC' },
  scrollContent: { paddingBottom: 120 }, // extra room so content not hidden by FAB
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  categoryTouchable: { borderRadius: 50 },
  categoryCircle: {
    backgroundColor: '#60A917',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  categoryImage: { width: 25, height: 25, marginBottom: 5 },
  categoryText: { color: '#fff', fontSize: 10, textAlign: 'center' },
  banner: {
    backgroundColor: '#556B2F',
    margin: 15,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  bannerText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { marginLeft: 15, marginTop: 10, fontSize: 18, fontWeight: 'bold', color: '#333' },
  horizontalScroll: { paddingHorizontal: 10, marginLeft: 8 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90, // sits above bottom tab bar
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
    overflow: 'hidden',
  },
  fabGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;