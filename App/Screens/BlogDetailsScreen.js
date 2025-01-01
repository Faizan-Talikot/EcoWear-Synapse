import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const BlogDetailsScreen = ({ route }) => {
  const { blog } = route.params;

  return (
    <ScrollView style={styles.container}>
      {/* Blog Title */}
      <Text style={styles.title}>{blog.title}</Text>

      {/* Blog Excerpt */}
      <Text style={styles.excerpt}>{blog.excerpt}</Text>

      {/* Blog Content */}
      <Text style={styles.content}>{blog.content}</Text>

      {/* Eco Tips Section */}
      <View style={styles.ecoTipsContainer}>
        <Text style={styles.ecoTipsTitle}>Eco Tip:</Text>
        <Text style={styles.ecoTip}>
          Choose timeless pieces that can last through seasons. Avoid fast fashion trends that contribute to environmental degradation.
        </Text>
      </View>

      {/* Divider for a Clean Break */}
      <View style={styles.divider}></View>

      {/* Call to Action */}
      <Text style={styles.cta}>
        Ready to make a sustainable fashion choice? Explore more eco-friendly options in our collection.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2F4F4F',
    lineHeight: 40,
    textAlign: 'center',
  },
  excerpt: {
    fontSize: 18,
    color: '#8E8E8E',
    marginBottom: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 26,
  },
  content: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 30,
  },
  ecoTipsContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#388E3C',
  },
  ecoTipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#388E3C',
    marginBottom: 10,
  },
  ecoTip: {
    fontSize: 16,
    color: '#2C6B2F',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 30,
  },
  cta: {
    fontSize: 18,
    color: '#388E3C',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
});

export default BlogDetailsScreen;
