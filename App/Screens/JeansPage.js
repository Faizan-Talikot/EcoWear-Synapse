import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet } from "react-native";
import {BASE_URL} from '../../env'

const JeansPage = () => {
  const [jeans, setJeans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJeans = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/jeans`);
        const data = await response.json();
        setJeans(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jeans:", error);
        setLoading(false);
      }
    };
  
    fetchJeans();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Our Jeans Collection</Text>
      <FlatList
        data={jeans}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        numColumns={2}
    />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5DC",
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    alignItems: "center",
    flex: 1, // Makes it adapt in a 2-column layout
    maxWidth: '48%', // To prevent overlap in a 2-column setup
  },  
  image: {
    width: '100%',
    height: 150,
    resizeMode: "cover",
    marginBottom: 10,
    borderRadius: 8,
  },  
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a8c37",
  },
});

export default JeansPage;