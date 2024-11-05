import React from 'react';
import { TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const BottomTabs = () => (
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
        backgroundColor: 'transparent', // Transparent to show the gradient
        borderTopWidth: 0, // Remove the border to avoid overlapping the gradient
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="History" component={HistoryScreen} />
    <Tab.Screen name="Scan" component={ScanScreen} />
    <Tab.Screen name="Catalog" component={CatalogScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="LoginScreen" component={LoginScreen}/> 
    <Tab.Screen name="Register" component={Register}/> 
  </Tab.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#34443D" />
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={({ navigation }) => ({
            headerTitle: () => null, // No title since we have a custom logo
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
      </Stack.Navigator>
    </NavigationContainer>
    // <View><LoginScreen/></View>
    // <View><Register/></View>
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