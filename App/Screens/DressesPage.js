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
import { useNavigation } from "@react-navigation/native";

const DressesPage = () => {
  const [dresses, setDresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDresses = async () => {
      try {
        const response = await fetch(`${BASE_URL}/dresses`);
        const data = await response.json();
        setDresses(data);
      } catch (error) {
        console.error("Error fetching dresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDresses();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.isPaid && <Text style={styles.adTag}>Ad</Text>}
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
      <Text style={styles.score}>Eco Score: {item.score}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("ItemDetail", {
            itemId: item.id,
            category: item.category,
          })
        }
      >
        <Text style={styles.buttonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRow = ({ item, index }) => {
    if (index % 2 === 0 && index < dresses.length - 1) {
      return (
        <View style={styles.rowContainer}>
          {renderItem({ item })}
          {renderItem({ item: dresses[index + 1] })}
        </View>
      );
    } else if (index % 2 === 0 && index === dresses.length - 1) {
      return (
        <View style={styles.rowContainer}>{renderItem({ item })}</View>
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
      <Text style={styles.header}>Women's Dresses</Text>
      <FlatList
        data={dresses}
        keyExtractor={(item) => item.id.toString()}
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
    backgroundColor: "#FDF6F0",
    paddingTop: StatusBar.currentHeight || 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#6A1B9A",
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
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E91E63",
    marginTop: 4,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  score: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#8E24AA",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default DressesPage;
