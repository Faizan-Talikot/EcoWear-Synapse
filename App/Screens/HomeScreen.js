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
    { name: 'T-shirts', image: require('../Assets/t-shirt.png') },
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
        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Categories */}
          <View style={styles.categories}>
            {categories.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryCircle}>
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
              <ProductCard key={product.id} product={product} onPress={()=>{}}/>
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

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#6B8E23' },
  container: { flex: 1, backgroundColor: '#F5F5DC' },
  scrollContent: { paddingBottom: 80 }, // Space for bottom nav
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#6B8E23',
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
    height: Platform.OS === 'ios' ? 80 : 60,
  },
  logo: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row', gap: 10 },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    // backgroundColor: '#6B8E23',
  },
  categoryTouchable: {
    borderRadius: 50,
  },
  categoryCircle: {
    backgroundColor: '#60A917',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  categoryImage: {
    width: 25, // Set smaller width
    height: 25, // Set smaller height
    marginBottom: 5,
  },
  categoryText: { color: '#fff', fontSize: 10, textAlign: 'center' },
  banner: {
    backgroundColor: '#556B2F',
    margin: 15,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  bannerText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sectionTitle: {
    marginLeft: 15,
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sponsoredContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingHorizontal: 10,
  },
  horizontalScroll: {
    paddingHorizontal: 10,
    marginLeft:8
  },
  sponsoredImage: {
    width: 150,
    height: 200,
    borderRadius: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#8FBC8F',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  scanButton: {
    position: 'relative',
    top: -30, // Raises the scan button slightly above other icons
    backgroundColor: '#F5F5DC',
    borderRadius: 30,
    padding: 10,
  },
  scanIcon: {
    padding: 3,
  },
  blogscontainer:{
    
  }
  
});

export default HomeScreen;