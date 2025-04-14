import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, FlatList, Image, StyleSheet } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import axios from 'axios';
import { BASE_URL } from '../env';

const dummyProfileImage = 'https://www.w3schools.com/w3images/avatar2.png'; // Dummy profile image

const ReviewSection = ({ itemId }) => {
  const [rating, setRating] = useState(0);
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      console.log(`Fetching reviews for itemId: ${itemId}`);
      const response = await fetch(`${BASE_URL}/${itemId}`);

      if (!response.ok) {
        const errorText = await response.text(); // Get error message body
        throw new Error(`Failed to fetch reviews. Status: ${response.status}. Error: ${errorText}`);
      }

      const data = await response.json();
      if (data.message === 'Item not found') {
        console.log('No reviews found for this item.');
      }
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err.message);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const submitReview = async () => {
    try {
      await axios.post(`${BASE_URL}/reviews`, {
        itemId,
        userName,
        rating,
        comment,
      });
      setUserName('');
      setRating(0);
      setComment('');
      fetchReviews();
    } catch (err) {
      console.error('Error submitting review', err);
    }
  };

  return (
    <View style={styles.container}>
        {/* Line Divider Above Customer Reviews */}
      <View style={styles.divider} />
      <Text style={styles.header}>Write a Review</Text>
      <TextInput
        placeholder="Your Name"
        value={userName}
        onChangeText={setUserName}
        style={styles.input}
      />
      <StarRating rating={rating} onChange={setRating} />
      <TextInput
        placeholder="Your Comment"
        value={comment}
        onChangeText={setComment}
        multiline
        style={styles.input}
      />
      <Button title="Submit Review" onPress={submitReview} />

      

      <Text style={[styles.header, styles.customerReviews]}>Customer Reviews</Text>
      {reviews.length === 0 ? (
  <Text style={{ fontStyle: 'italic', color: 'gray', textAlign: 'center', marginVertical: 10 }}>
    No reviews yet.
  </Text>
) : (
  <FlatList
    data={reviews}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => (
      <View style={styles.reviewItem}>
        <View style={styles.profileContainer}>
          <Image source={{ uri: dummyProfileImage }} style={styles.profileImage} />
          <Text style={styles.reviewUserName}>{item.userName}</Text>
        </View>
        <StarRating rating={item.rating} onChange={() => {}} starSize={16} enableSwiping={false} />
        <Text style={styles.comment}>{item.comment}</Text>
      </View>
    )}
  />
)}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  customerReviews: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginVertical: 8,
  },
  reviewItem: {
    marginVertical: 8,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewUserName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  comment: {
    marginTop: 5,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 15,
    width: '110%',
    alignSelf: 'center',
  }
  
});

export default ReviewSection;
