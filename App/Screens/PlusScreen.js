import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const PlusScreen = () => {
  const navigation = useNavigation();

  const features = [
    {
      title: '🤖 AI Purchase Predictor',
      description: 'Predict your eco-friendly shopping behavior using AI',
      onPress: () => navigation.navigate('MLPrediction'),
      icon: 'analytics-outline',
      color: ['#34443D', '#67775E']
    },
    {
      title: '📊 Sustainability Analytics',
      description: 'Coming Soon: View your sustainability metrics',
      onPress: () => {},
      icon: 'bar-chart-outline',
      color: ['#67775E', '#8FBC8F']
    },
    {
      title: '🎯 Eco Goals',
      description: 'Coming Soon: Set and track your eco-friendly goals',
      onPress: () => {},
      icon: 'trophy-outline',
      color: ['#8FBC8F', '#9ACD32']
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>✨ EcoWear Plus Features</Text>
          <Text style={styles.subtitle}>Explore advanced sustainability tools</Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={styles.featureCard}
              onPress={feature.onPress}
              activeOpacity={0.8}
            >
              <LinearGradient colors={feature.color} style={styles.cardGradient}>
                <Icon name={feature.icon} size={40} color="#fff" style={styles.featureIcon} />
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34443D',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#67775E',
    textAlign: 'center',
    marginTop: 5,
  },
  featuresContainer: {
    gap: 15,
  },
  featureCard: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 150,
    justifyContent: 'center',
  },
  featureIcon: {
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
});

export default PlusScreen;
