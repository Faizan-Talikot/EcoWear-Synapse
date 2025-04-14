import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
  Image,
} from 'react-native';
import { BASE_URL } from '../../env';
import { Search, X } from 'react-native-feather'; // Feather icons for search and clear

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current; // For results animation
  const inputRef = useRef(null); // For focusing input

  const handleSearch = async (text) => {
    setQuery(text);
    setError(null);

    if (text.trim() === '') {
      setResults([]);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(text)}`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid search response: Expected an array');
      }
      setResults(data);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Search error:', error.message);
      setError('Failed to fetch search results. Please try again.');
      setResults([]);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item) => {
    if (!item.id || !item.category) {
      Alert.alert('Error', 'Invalid item selected. Missing ID or category.');
      return;
    }

    setQuery(item.name || item);
    setResults([]);
    navigation.navigate('ItemDetail', {
      itemId: item.id,
      category: item.category,
    });
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setError(null);
    inputRef.current?.focus();
  };

  const renderItemImage = (item) => {
    if (!item.imageUrl) {
      return (
        <View style={styles.itemImagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>
            {item.category ? item.category[0].toUpperCase() : '?'}
          </Text>
        </View>
      );
    }

    return (
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.itemImage}
        resizeMode="cover"
        onError={() => console.warn(`Failed to load image: ${item.imageUrl}`)}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search width={20} height={20} stroke="#666" style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Search brands, products..."
          placeholderTextColor="#888"
          value={query}
          onChangeText={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <X width={20} height={20} stroke="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Loading State */}
      {loading && (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator size="large" color="#1a8c37" />
          <Text style={styles.feedbackText}>Searching...</Text>
        </View>
      )}

      {/* Error State */}
      {error && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => handleSearch(query)} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results List */}
      {!loading && !error && results.length > 0 && (
        <Animated.View style={[styles.resultsContainer, { opacity: fadeAnim }]}>
          <FlatList
            data={results}
            keyExtractor={(item) => `${item.category}-${item.id}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelect(item)}
              >
                <View style={styles.itemContent}>
                  {renderItemImage(item)}
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>
                      {item.name || 'Unnamed item'}
                    </Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      )}

      {/* No Results */}
      {!loading && !error && query.trim() !== '' && results.length === 0 && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.noResult}>No results found</Text>
          <Text style={styles.noResultHint}>Try a different keyword, like "jeans" or "shirt"</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5DC',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 8,
  },
  feedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackText: {
    marginTop: 8,
    fontSize: 16,
    color: '#1a8c37',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#1a8c37',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
  },
  resultItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  itemImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  imagePlaceholderText: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  categoryBadge: {
    backgroundColor: '#e8f5e9',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    color: '#1a8c37',
    fontWeight: '500',
  },
  noResult: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  noResultHint: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default SearchScreen;