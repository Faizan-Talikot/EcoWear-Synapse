import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList, Modal, TextInput, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { BASE_URL } from '../../env';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For the heart icon (like button)
import faqs from '../../Components/faq';
import { LayoutAnimation, UIManager, Platform } from 'react-native';
import ReviewSection from '../../Components/ReviewSection';
import { Heart } from 'react-native-feather';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ItemDetailScreen = () => {
  const route = useRoute();
  const { itemId, category } = route.params;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [faqsState, setFaqsState] = useState(
    faqs.map(f => ({ ...f, open: false }))
  );
  
  const [showModal, setShowModal] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`${BASE_URL}/${category}/${itemId}`); // Include both category and itemId
        const data = await response.json();
        setItem(data);
      } catch (err) {
        console.error("Failed to fetch item details", err);
      } finally {
        setLoading(false);
      }
    };

    if (itemId && category) {
      fetchItem();
    }
  }, [category, itemId]);

  const renderFaq = ({ item, index }) => (
    <View style={styles.faqItem}>
      <Text
        style={styles.faqQuestion}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          const updatedFaqs = [...faqsState];
          updatedFaqs[index].open = !updatedFaqs[index].open;
          setFaqsState(updatedFaqs);
        }}
      >
        • {item.question}
      </Text>
      {faqsState[index].open && (
        <Text style={styles.faqAnswer}>{item.answer}</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#228B22" />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Item not found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={[item]} // Just one item, as we are passing the fetched product.
      renderItem={({ item }) => (
        <View style={styles.container}>
          {/* Image Section */}
          <Image source={{ uri: item.imageUrl }} style={styles.image} />

          {/* Name and Description */}
          <View style={styles.detailsContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.name}>{item.name}</Text>
              {/* Heart icon */}
              <TouchableOpacity style={styles.likeButton}>
                {/* <Icon name="favorite-border" size={32} color="#E91E63" /> */}
                <Heart width={32} height={32} stroke="#E91E63" fill="none" />
                {/* <FontAwesomeIcon icon="fa-regular fa-heart" /> */}
              </TouchableOpacity>
            </View>
            <Text style={styles.brand}>{item.brand}</Text>
            <Text style={styles.price}>₹{item.price}</Text>
            <Text style={styles.score}>Eco Score: {item.score}</Text>
            <Text style={styles.description}>{item.description || "No description available."}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buyButton}>
              <Text style={styles.buttonText}>Buy Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cartButton}>
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>

          {/* Review Section */}
          <ReviewSection itemId={itemId} />

          {/* FAQ Section */}
          <View style={styles.faqContainer}>
            <Text style={styles.sectionTitle}>FAQs</Text>
            <FlatList
              data={faqs}
              renderItem={renderFaq}
              keyExtractor={(faq, index) => index.toString()}
            />
          </View>

          {/* Ask a Question Button */}
          <TouchableOpacity style={styles.askBtn} onPress={() => setShowModal(true)}>
            <Text style={styles.askBtnText}>Ask a Question</Text>
          </TouchableOpacity>

          {/* Modal for Asking Question */}
          <Modal visible={showModal} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Ask a Question</Text>
                <TextInput
                  placeholder="Your Name"
                  value={userName}
                  onChangeText={setUserName}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Your Question"
                  value={userQuestion}
                  onChangeText={setUserQuestion}
                  style={[styles.input, { height: 80 }]}
                  multiline
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalSubmit}
                    onPress={async () => {
                      if (!userName || !userQuestion) return Alert.alert('Please fill all fields');
                      try {
                        await fetch(`${BASE_URL}/questions`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ name: userName, question: userQuestion, itemId }),
                        });
                        Alert.alert("Thank you!", "Your question has been submitted.");
                        setUserName('');
                        setUserQuestion('');
                        setShowModal(false);
                      } catch (err) {
                        Alert.alert("Error", "Failed to submit question");
                        console.log(err);
                      }
                    }}
                  >
                    <Text style={styles.modalSubmitText}>Submit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowModal(false)}>
                    <Text style={{ color: 'red', marginTop: 10 }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30, // Added padding at the bottom
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  image: {
    width: '100%',
    height: 450,
    borderRadius: 16,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  detailsContainer: {
    marginBottom: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  brand: {
    fontSize: 18,
    color: '#555',
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1a8c37',
    marginBottom: 10,
  },
  score: {
    fontSize: 18,
    color: '#228B22',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  buyButton: {
    backgroundColor: '#1a8c37',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  cartButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  likeButton: {
    paddingLeft: 0,
    marginRight: 6,
  },
  faqContainer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  faqItem: {
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a8c37',
  },
  faqAnswer: {
    fontSize: 15,
    color: '#555',
    marginTop: 4,
    paddingLeft: 10,
  },
  askBtn: {
    backgroundColor: '#1a8c37',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 10,
  },
  askBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    alignItems: 'center',
  },
  modalSubmit: {
    backgroundColor: '#1a8c37',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  modalSubmitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ItemDetailScreen;
