import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';

const FabricInfo = ({ route }) => {
  const [barcodeData, setBarcodeData] = useState(null); // Changed to null since we are expecting a single object
  const { data } = route.params; // The barcode data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://192.168.85.67:5001/api/barcode-data/${data}`);
          
        if (response.status === 200 && response.data) {
          setBarcodeData(response.data);
        } else {
          console.error('Error: Received invalid response data');
        }
      } catch (error) {
        console.error('Error fetching the data', error.response || error.message);
      }
    };
  
    fetchData();
  }, [data]);
  

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
