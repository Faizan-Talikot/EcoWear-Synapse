import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';

const FabricInfo = () => {
    const [barcodeData, setBarcodeData] = useState([]);
    const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity
    const slideAnim = useRef(new Animated.Value(-50)).current; // Initial value for position
    const scaleAnim = useRef(new Animated.Value(1)).current; // Initial value for scale
    const rotateAnim = useRef(new Animated.Value(0)).current; // Initial value for rotation

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://192.168.0.102:5001/api/barcode-data'); // Replace with your local IP address
                setBarcodeData(response.data);
                animateItems(); // Trigger the animations after setting the data
            } catch (error) {
                console.error('Error fetching the data', error);
            }
        };

        fetchData();
    }, []);

    const animateItems = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    };

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 0.95,
                useNativeDriver: true,
            }),
            Animated.spring(rotateAnim, {
                toValue: 1,
                useNativeDriver: true,
            })
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
            }),
            Animated.spring(rotateAnim, {
                toValue: 0,
                useNativeDriver: true,
            })
        ]).start();
    };

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '10deg'],
    });

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Fabric Information</Text>
            {barcodeData.length === 0 ? <Text>No data available</Text> : null}
            {barcodeData.map(item => (
                <TouchableWithoutFeedback
                    key={item._id.$oid}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                >
                    <Animated.View style={[styles.item, { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }, { rotate: rotation }] }]}>
                        <Text style={styles.subtitle}>{item.fabric}</Text>
                        <Text style={styles.text}>Barcode ID: {item.barcode_id}</Text>
                        <Text style={styles.text}>Sustainability Score: {item.sustainability_score}</Text>
                        <Text style={styles.detailsTitle}>Details:</Text>
                        <Text style={styles.text}>Fabric Type Impact: {item.details.fabric_type_impact}</Text>
                        <Text style={styles.text}>Brand Sustainability Rating: {item.details.brand_sustainability_rating}</Text>
                        <Text style={styles.text}>Carbon Footprint: {item.details.carbon_footprint}</Text>
                        <Text style={styles.text}>Water Usage: {item.details.water_usage}</Text>
                        <Text style={styles.text}>Certifications & Labels: {item.details.certifications_labels}</Text>
                        <Text style={styles.text}>Recycling & Disposal: {item.details.recycling_disposal}</Text>
                        <Text style={styles.text}>Alternative Suggestions: {item.details.alternative_suggestions}</Text>
                    </Animated.View>
                </TouchableWithoutFeedback>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#333',
    },
    item: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00796b',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    detailsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
        color: '#333',
    },
});

export default FabricInfo;
