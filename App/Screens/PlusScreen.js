import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlusScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Plus Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5DC',
  },
});

export default PlusScreen;
