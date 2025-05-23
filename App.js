import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BlogDetailsScreen from './App/Screens/BlogDetailsScreen';
import ItemDetailScreen from './App/Screens/ItemDetailScreen';


// Import screens
import HomeScreen from './App/Screens/HomeScreen';
import HistoryScreen from './App/Screens/HistoryScreen';
import ScanScreen from './App/Screens/ScanScreen';
import CatalogScreen from './App/Screens/CatalogScreen';
import ProfileScreen from './App/Screens/ProfileScreen';
import PlusScreen from './App/Screens/PlusScreen';
import SearchScreen from './App/Screens/SearchScreen';
import LoginScreen from './App/Screens/LogIn';
import Register from './App/Screens/Register';
import FabricInfo from './App/Screens/FabricInfo';
import JeansPage from './App/Screens/JeansPage';
import ShirtsPage from './App/Screens/ShirtsPage';
import TShirtsPage from './App/Screens/TShirtsPage';
import HoodiesPage from './App/Screens/HoodiesPage';
import DressesPage from './App/Screens/DressesPage'
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const BottomTabs = ({ onLogoutSuccess }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = 'home-outline';
        } else if (route.name === 'History') {
          iconName = 'time-outline';
        } else if (route.name === 'Scan') {
          iconName = 'barcode-outline';
        } else if (route.name === 'Catalog') {
          iconName = 'list-outline';
        } else if (route.name === 'Profile') {
          iconName = 'person-outline';
        }
        return (
          <View style={styles.iconContainer}>
            <Icon name={iconName} size={size} color={color} />
          </View>
        );
      },
      tabBarActiveTintColor: '#fff',
      tabBarInactiveTintColor: '#B2C2A9',
      headerShown: false,
      tabBarBackground: () => (
        <LinearGradient
          colors={['#34443D', '#67775E']}
          style={StyleSheet.absoluteFillObject}
        />
      ),
      tabBarStyle: {
        backgroundColor: 'transparent',
        borderTopWidth: 0,
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="History" component={HistoryScreen} />
    <Tab.Screen name="Scan" component={ScanScreen} />
    <Tab.Screen name="Catalog" component={CatalogScreen} />
    <Tab.Screen name="Profile">
      {() => <ProfileScreen onLogoutSuccess={onLogoutSuccess} />}
    </Tab.Screen>
  </Tab.Navigator>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function getData() {
    const data = await AsyncStorage.getItem('isLoggedIn');
    setIsLoggedIn(data);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#34443D" />
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen
            name="Main"
            options={({ navigation }) => ({
              headerTitle: () => null,
              headerLeft: () => (
                <Image
                  source={require('./App/Assets/logo.png')}
                  style={{ width: 120, height: 50, marginLeft: -10 }}
                />
              ),
              headerRight: () => (
                <View style={styles.headerIcons}>
                  <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                    <Icon name="search" size={24} color="#fff" style={{ marginRight: 15 }} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('Plus')}>
                    <Icon name="add" size={28} color="#fff" style={{ marginRight: 15 }} />
                  </TouchableOpacity>
                </View>
              ),
              headerBackground: () => (
                <LinearGradient
                  colors={['#34443D', '#67775E']}
                  style={{ flex: 1 }}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                />
              ),
            })}
          >
            {() => <BottomTabs onLogoutSuccess={() => setIsLoggedIn(false)} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
          >
            {() => <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />}
          </Stack.Screen>
        )}
        
        {/* Add Jeans Page to the Stack Navigator */}
        <Stack.Screen
          name="Jeans"
          component={JeansPage}
          options={{
            headerTitle: 'Jeans',
            headerTintColor: '#fff',
            headerBackground: () => (
              <LinearGradient
                colors={['#34443D', '#67775E']}
                style={StyleSheet.absoluteFillObject}
              />
            ),
          }}
        />
        <Stack.Screen
          name="Shirts"
          component={ShirtsPage}
          options={{
            headerTitle: 'Shirts',
            headerTintColor: '#fff',
            headerBackground: () => (
              <LinearGradient
                colors={['#34443D', '#67775E']}
                style={StyleSheet.absoluteFillObject}
              />
            ),
          }}
        />
        <Stack.Screen
          name="TShirts"
          component={TShirtsPage}
          options={{
            headerTitle: 'TShirts',
            headerTintColor: '#fff',
            headerBackground: () => (
              <LinearGradient
                colors={['#34443D', '#67775E']}
                style={StyleSheet.absoluteFillObject}
              />
            ),
          }}
        />
<Stack.Screen
  name="Hoodies"
  component={HoodiesPage}
  options={{
    headerTitle: 'Hoodies',
    headerTintColor: '#fff',
    headerBackground: () => (
      <LinearGradient
        colors={['#34443D', '#67775E']}
        style={StyleSheet.absoluteFillObject}
      />
    ),
  }}
/>

<Stack.Screen
  name="Dresses"
  component={DressesPage}
  options={{
    headerTitle: 'Dresses',
    headerTintColor: '#fff',
    headerBackground: () => (
      <LinearGradient
        colors={['#34443D', '#67775E']}
        style={StyleSheet.absoluteFillObject}
      />
    ),
  }}
/>

        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Plus"
          component={PlusScreen}
          options={{
            headerTitle: 'Plus',
            headerTintColor: '#fff',
            headerBackground: () => (
              <LinearGradient
                colors={['#34443D', '#67775E']}
                style={StyleSheet.absoluteFillObject}
              />
            ),
          }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            headerTitle: 'Search',
            headerTintColor: '#fff',
            headerBackground: () => (
              <LinearGradient
                colors={['#34443D', '#67775E']}
                style={StyleSheet.absoluteFillObject}
              />
            ),
          }}
        />
        <Stack.Screen
  name="FabricInfo"
  component={FabricInfo}
  options={{
    headerTitle: 'Fabric Information',
    headerTintColor: '#fff',
    headerBackground: () => (
      <LinearGradient
        colors={['#34443D', '#67775E']}
        style={StyleSheet.absoluteFillObject}
      />
    ),
  }}
/>
<Stack.Screen
  name="BlogDetails"
  component={BlogDetailsScreen}
  options={{ title: 'Blog Details' }}
/>
<Stack.Screen
  name="ItemDetail"
  component={ItemDetailScreen}
  options={{ title: 'Item Details' }}
/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
