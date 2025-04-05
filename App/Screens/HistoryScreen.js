import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../env';
import { useFocusEffect } from '@react-navigation/native';

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const fetchHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const userResponse = await fetch(`${BASE_URL}/userdata`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const userJson = await userResponse.json();
      const email = userJson.data?.email;
      if (!email) return;
      setUserEmail(email);

      const historyResponse = await axios.post(`${BASE_URL}/get-history`, {
        user: email,
      });

      if (historyResponse.data.status === 'ok') {
        setHistory(historyResponse.data.data);
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await axios.post(`${BASE_URL}/clear-history`, {
                user: userEmail,
              });

              if (response.data.status === 'ok') {
                setHistory([]);
              }
            } catch (error) {
              console.error('Error clearing history:', error);
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchHistory();
    }, [])
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#00796b" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan History</Text>

      {history.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
          <Text style={styles.clearButtonText}>Clear History</Text>
        </TouchableOpacity>
      )}

      {history.length === 0 ? (
        <Text style={styles.empty}>No history found</Text>
      ) : (
        <FlatList
          contentContainerStyle={{ paddingBottom: 20 }}
          data={history}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.label}>Type:</Text>
              <Text style={styles.value}>{item.type}</Text>

              <Text style={styles.label}>Brand:</Text>
              <Text style={styles.value}>{item.brand}</Text>

              <Text style={styles.label}>Score:</Text>
              <Text style={[styles.value, styles.scoreValue(item.score)]}>{item.score}</Text>

              <Text style={styles.label}>Eco-Friendly:</Text>
              <Text style={[styles.value, { color: item.ecoFriendly ? '#388e3c' : '#d32f2f' }]}>
                {item.ecoFriendly ? 'Yes' : 'No'}
              </Text>

              <Text style={styles.label}>Scanned At:</Text>
              <Text style={styles.value}>
                {new Date(item.date || item.scannedAt).toLocaleString()}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00796b',
    marginBottom: 10,
    textAlign: 'center',
  },
  clearButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#d32f2f',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginTop: 6,
  },
  value: {
    fontSize: 16,
    color: '#222',
    marginBottom: 4,
  },
  scoreValue: (score) => ({
    color: score >= 75 ? '#2e7d32' : score >= 50 ? '#f9a825' : '#c62828',
    fontWeight: 'bold',
  }),
  empty: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 30,
    color: '#888',
  },
});

export default HistoryScreen;
