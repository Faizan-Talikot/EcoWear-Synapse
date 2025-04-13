import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { BASE_URL } from '../../env';

const JeansPage = () => {
  const [jeans, setJeans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJeans = async () => {
      try {
        const response = await fetch(`${BASE_URL}/jeans`);
        const data = await response.json();
        setJeans(data);
      } catch (error) {
        console.error("Error fetching jeans:", error);
      } finally {
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
      {item.isPaid && <Text style={styles.adTag}>Ad</Text>}
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.brand}>{item.brand}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
      <Text style={styles.score}>Eco Score: {item.score}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  // Convert into rows of 2 items (like in CatalogScreen)
  const renderRow = ({ item, index }) => {
    if (index % 2 === 0 && index < jeans.length - 1) {
      return (
        <View style={styles.rowContainer}>
          {renderItem({ item })}
          {renderItem({ item: jeans[index + 1] })}
        </View>
      );
    } else if (index % 2 === 0 && index === jeans.length - 1) {
      return (
        <View style={styles.rowContainer}>
          {renderItem({ item })}
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Our Jeans Collection</Text>
      <FlatList
        data={jeans}
        keyExtractor={(item) => item.id}
        renderItem={renderRow}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    paddingTop: StatusBar.currentHeight || 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    width: '48%',
  },
  adTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFD700',
    color: '#333',
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  brand: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a8c37',
    marginBottom: 4,
  },
  score: {
    fontSize: 14,
    color: '#228B22',
    fontWeight: '500',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#228B22',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default JeansPage;
