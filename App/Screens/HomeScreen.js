import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, SafeAreaView, Platform, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>EcoWear</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity>
                <Icon name="add" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon name="search" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Categories */}
          <View style={styles.categories}>
            {['Shirts', 'T-shirts', 'Jeans', 'Hoodies', 'Dresses'].map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryCircle}>
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Banner */}
          <TouchableOpacity style={styles.banner}>
            <Text style={styles.bannerText}>Be Aware, Choose EcoWear</Text>
          </TouchableOpacity>

          {/* Sponsored Wardrobe */}
          <Text style={styles.sectionTitle}>Our EcoFriendly Wardrobe</Text>
          <View style={styles.sponsoredContainer}>
            <Image source={require('../Assets/pro1.webp')} style={styles.sponsoredImage} />
            <Image source={require('../Assets/pro3.webp')} style={styles.sponsoredImage} />
          </View>
          <View style={styles.sponsoredContainer}>
            <Image source={require('../Assets/pro1.webp')} style={styles.sponsoredImage} />
            <Image source={require('../Assets/pro3.webp')} style={styles.sponsoredImage} />
          </View>
          <View style={styles.sponsoredContainer}>
            <Image source={require('../Assets/pro1.webp')} style={styles.sponsoredImage} />
            <Image source={require('../Assets/pro3.webp')} style={styles.sponsoredImage} />
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <Icon name="home-outline" size={24} color="#333" />
          <Icon name="time-outline" size={24} color="#333" />
          <TouchableOpacity style={styles.scanButton}>
            <Icon style={styles.scanIcon} name="barcode-outline" size={30} color="#333" />
          </TouchableOpacity>
          <Icon name="list-outline" size={24} color="#333" />
          <Icon name="person-outline" size={24} color="#333" />
        </View>
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
    backgroundColor: '#6B8E23',
  },
  categoryCircle: {
    backgroundColor: '#8FBC8F',
    borderRadius: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  categoryText: { color: '#fff', fontSize: 12, textAlign: 'center' },
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
    justifyContent: 'space-around',
    padding: 10,
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
});

export default HomeScreen;
