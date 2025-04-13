import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { BASE_URL } from "../../env";

const ShirtsPage = () => {
  const [shirts, setShirts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShirts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/shirts`);
        const data = await response.json();
        setShirts(data);
      } catch (error) {
        console.error("Error fetching shirts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShirts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.isPaid && <Text style={styles.adTag}>Ad</Text>}
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRow = ({ item, index }) => {
    if (index % 2 === 0 && index < shirts.length - 1) {
      return (
        <View style={styles.rowContainer}>
          {renderItem({ item })}
          {renderItem({ item: shirts[index + 1] })}
        </View>
      );
    } else if (index % 2 === 0 && index === shirts.length - 1) {
      return (
        <View style={styles.rowContainer}>
          {renderItem({ item })}
        </View>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Our Shirts Collection</Text>
      <FlatList
        data={shirts}
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
    width: "48%",
  },
  adTag: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FFD700",
    color: "#333",
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  description: {
    fontSize: 14,
    color: "#777",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a8c37",
    marginTop: 4,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#228B22",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,

    alignSelf: "flex-start",
    width: "100%"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default ShirtsPage;
