import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const ThermometerIndicator = ({ sustainabilityScore }) => {
    

    return (
        <View style={styles.container}>
            
            <Text style={styles.score}>{sustainabilityScore}%</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    thermometerContainer: {
        width: 40,
        height: 200,
        backgroundColor: '#e0e0e0',
        borderRadius: 20,
        overflow: 'hidden',
        marginVertical: 20,
        position: 'relative',
    },
    fill: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderRadius: 20,
    },
    score: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
    },
});

export default ThermometerIndicator;
