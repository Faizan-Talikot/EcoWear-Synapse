import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Animated,
  StatusBar,
} from "react-native";
import { BASE_URL } from "../../env";

const ShirtsPage = () => {
  const [shirts, setShirts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    const fetchShirts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/shirts`);
        const data = await response.json();
        setShirts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching shirts:", error);
        setLoading(false);
      }
    };

    fetchShirts();
  }, []);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.header, { opacity: headerOpacity }]}>
        Our Shirts Collection
      </Animated.Text>
      <Animated.FlatList
        data={shirts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        numColumns={2}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F0F2",
    paddingTop: StatusBar.currentHeight || 50,
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
    flex: 1,
    maxWidth: "48%",
  },
  image: {
    width: "100%",
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

export default ShirtsPage;
