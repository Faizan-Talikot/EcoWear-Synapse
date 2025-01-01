import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BlogCard = ({ blog, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <LinearGradient
        colors={['#34443D', '#67775E']}
        style={styles.gradientBackground}
      >
        <Text style={styles.title}>{blog.title}</Text>
        <Text style={styles.excerpt}>{blog.excerpt}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 15,
    width: 220,
    height: 140,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginTop: 10,
  },
  gradientBackground: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  excerpt: {
    fontSize: 14,
    color: '#DDE5D9',
  },
});

export default BlogCard;
