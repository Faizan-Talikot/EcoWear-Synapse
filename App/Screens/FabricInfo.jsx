import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import {BASE_URL} from '../../env'
import AsyncStorage from '@react-native-async-storage/async-storage';

const FabricInfo = ({ route }) => {
  const [barcodeData, setBarcodeData] = useState(null); // Changed to null since we are expecting a single object
  const { data } = route.params; // The barcode data
  const [userData, setUserData] = useState('');


  useEffect(() => {
    const fetchBarcodeData = async () => {
      try {
        console.log('Fetching barcode data for:', data);
        const response = await axios.get(`${BASE_URL}/api/barcode-data/${data}`);
    
        if (response.status === 200 && response.data) {
          const fetchedData = response.data;
          console.log('Barcode data received:', fetchedData);
          setBarcodeData(fetchedData);
        } else {
          console.error('Error: Received invalid response data');
        }
      } catch (error) {
        console.error('Error fetching barcode data:', error.response || error.message);
      }
    };    
  
    if (data) {
      fetchBarcodeData();
    }
  }, [data]);

  // Separate effect for adding scan history (only when both barcode data and user data are available)
  useEffect(() => {
    const addScanHistory = async () => {
      if (!userData || !userData.email || !barcodeData) {
        return;
      }

      try {
        await axios.post(`${BASE_URL}/add`, {
          user: userData.email,
          type: barcodeData.fabric,
          barcode_id: barcodeData.barcode_id,
          score: barcodeData.sustainability_score,
          ecoFriendly: true
        });
        console.log('Scan history added successfully');
      } catch (error) {
        console.error('Error adding scan history:', error.response || error.message);
      }
    };

    addScanHistory();
  }, [userData, barcodeData]);
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

  
        if (!token) {
          console.warn("No token found in storage.");
          return;
        }
  
        const response = await fetch(`${BASE_URL}/userdata`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });
  
        const json = await response.json();

  
        if (json.data) {
          setUserData(json.data);
        } else {
          console.warn("User data not found in response.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, []);
  
  

  const getSustainabilityColor = (score) => {
    if (score >= 75) {
      return '#66BB6A';
    } else if (score >= 50) {
      return '#FFEB3B';
    } else {
      return '#FF5252';
    }
  };

  if (!barcodeData) {
    return <Text>Loading data...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Fabric Information</Text>
      <View style={styles.item}>
        <Text style={styles.subtitle}>{barcodeData.fabric}</Text>
        <Text style={styles.text}>Barcode ID: {barcodeData.barcode_id}</Text>
        <Text style={[styles.sustainabilityScore, { color: getSustainabilityColor(barcodeData.sustainability_score) }]}>
          Sustainability Score: {barcodeData.sustainability_score}
        </Text>
        <Text style={styles.detailsTitle}>Details:</Text>
        <Text style={styles.text}>Fabric Type Impact: {barcodeData.details.fabric_type_impact}</Text>
        <Text style={styles.text}>Brand Sustainability Rating: {barcodeData.details.brand_sustainability_rating}</Text>
        <Text style={styles.text}>Carbon Footprint: {barcodeData.details.carbon_footprint}</Text>
        <Text style={styles.text}>Water Usage: {barcodeData.details.water_usage}</Text>
        <Text style={styles.text}>Certifications & Labels: {barcodeData.details.certifications_labels}</Text>
        <Text style={styles.text}>Recycling & Disposal: {barcodeData.details.recycling_disposal}</Text>
        <Text style={styles.text}>Alternative Suggestions: {barcodeData.details.alternative_suggestions}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796b',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  sustainabilityScore: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
});

export default FabricInfo;
