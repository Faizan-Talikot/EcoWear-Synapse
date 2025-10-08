import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { BASE_URL } from '../../env';

const MLPredictionScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age_group: '18-25',
    gender: 'Male',
    education_level: 'High School',
    monthly_income: 'Not Earning',
    occupation: 'Student',
    aware_of_fast_fashion_impact: 'Yes',
    sustainability_importance: 3,
    motivation_to_buy: 'Social Responsibility',
    purchased_eco_friendly_before: 'Yes',
    frequency_of_purchase: 'Never',
    price_influence: 3,
    brand_influence: 3,
    sustainability_influence: 3,
    social_influence: 3,
    product_quality_influence: 3,
    primary_barrier: 'High Cost',
  });

  const [prediction, setPrediction] = useState(null);

  // Form field options
  const ageGroups = ['18-25', '26-35', '36-45', '46-55', '56+'];
  const genders = ['Male', 'Female', 'Other'];
  const educationLevels = ['High School', 'Bachelor\'s', 'Master\'s', 'PhD', 'Other'];
  const incomes = ['Not Earning', '< ₹20,000', '₹20,000 - ₹40,000', '₹40,000 - ₹60,000', '₹60,000+'];
  const occupations = ['Student', 'Professional', 'Business Owner', 'Employee', 'Other'];
  const yesNoOptions = ['Yes', 'No'];
  const motivations = [
    'Social Responsibility',
    'Environmental Impact',
    'Quality',
    'Brand Image',
    'Personal Values',
    'Trends'
  ];
  const frequencies = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];
  const barriers = [
    'High Cost',
    'Limited Availability',
    'Lack of Information',
    'Design/Style',
    'Quality Concerns',
    'No Barriers'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSliderChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const makePrediction = async () => {
    setLoading(true);
    try {
      // Replace with your ML backend URL when deployed
      const mlApiUrl = 'https://your-ml-backend.onrender.com/predict'; // We'll update this later
      
      const response = await fetch(mlApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const result = await response.json();
      setPrediction(result);

      Alert.alert(
        'Prediction Result',
        `Will Buy Eco-Friendly: ${result.will_buy ? 'Yes' : 'No'}\\nConfidence: ${(result.confidence_score * 100).toFixed(1)}%`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Prediction error:', error);
      Alert.alert('Error', 'Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderSlider = (label, field, value) => (
    <View style={styles.sliderContainer}>
      <Text style={styles.sliderLabel}>{label}: {value}</Text>
      <View style={styles.sliderRow}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.sliderButton,
              value === num && styles.sliderButtonActive
            ]}
            onPress={() => handleSliderChange(field, num)}
          >
            <Text style={[
              styles.sliderButtonText,
              value === num && styles.sliderButtonTextActive
            ]}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#F5F5DC', '#E6E6FA']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>🌱 Eco-Fashion Prediction</Text>
          <Text style={styles.subtitle}>Help us predict your eco-friendly shopping behavior</Text>
        </View>

        <View style={styles.form}>
          {/* Age Group */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Age Group</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.age_group}
                onValueChange={(value) => handleInputChange('age_group', value)}
                style={styles.picker}
              >
                {ageGroups.map((age) => (
                  <Picker.Item key={age} label={age} value={age} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Gender */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Gender</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.gender}
                onValueChange={(value) => handleInputChange('gender', value)}
                style={styles.picker}
              >
                {genders.map((gender) => (
                  <Picker.Item key={gender} label={gender} value={gender} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Education Level */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Education Level</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.education_level}
                onValueChange={(value) => handleInputChange('education_level', value)}
                style={styles.picker}
              >
                {educationLevels.map((edu) => (
                  <Picker.Item key={edu} label={edu} value={edu} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Monthly Income */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Monthly Income (INR)</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.monthly_income}
                onValueChange={(value) => handleInputChange('monthly_income', value)}
                style={styles.picker}
              >
                {incomes.map((income) => (
                  <Picker.Item key={income} label={income} value={income} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Occupation */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Occupation</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.occupation}
                onValueChange={(value) => handleInputChange('occupation', value)}
                style={styles.picker}
              >
                {occupations.map((occ) => (
                  <Picker.Item key={occ} label={occ} value={occ} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Aware of Fast Fashion Impact */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Aware of Fast Fashion Impact?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.aware_of_fast_fashion_impact}
                onValueChange={(value) => handleInputChange('aware_of_fast_fashion_impact', value)}
                style={styles.picker}
              >
                {yesNoOptions.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Sustainability Importance Slider */}
          {renderSlider('Sustainability Importance (1-5)', 'sustainability_importance', formData.sustainability_importance)}

          {/* Motivation */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>What Motivates You to Buy Eco-Friendly?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.motivation_to_buy}
                onValueChange={(value) => handleInputChange('motivation_to_buy', value)}
                style={styles.picker}
              >
                {motivations.map((mot) => (
                  <Picker.Item key={mot} label={mot} value={mot} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Purchased Eco-Friendly Before */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Purchased Eco-Friendly Before?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.purchased_eco_friendly_before}
                onValueChange={(value) => handleInputChange('purchased_eco_friendly_before', value)}
                style={styles.picker}
              >
                {yesNoOptions.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Frequency */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>If Yes, How Frequently?</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.frequency_of_purchase}
                onValueChange={(value) => handleInputChange('frequency_of_purchase', value)}
                style={styles.picker}
              >
                {frequencies.map((freq) => (
                  <Picker.Item key={freq} label={freq} value={freq} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Influence Factors Sliders */}
          {renderSlider('Price Influence (1-5)', 'price_influence', formData.price_influence)}
          {renderSlider('Brand Influence (1-5)', 'brand_influence', formData.brand_influence)}
          {renderSlider('Sustainability Influence (1-5)', 'sustainability_influence', formData.sustainability_influence)}
          {renderSlider('Social Influence (1-5)', 'social_influence', formData.social_influence)}
          {renderSlider('Product Quality Influence (1-5)', 'product_quality_influence', formData.product_quality_influence)}

          {/* Primary Barrier */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Primary Barrier</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.primary_barrier}
                onValueChange={(value) => handleInputChange('primary_barrier', value)}
                style={styles.picker}
              >
                {barriers.map((barrier) => (
                  <Picker.Item key={barrier} label={barrier} value={barrier} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Prediction Button */}
          <TouchableOpacity
            style={styles.predictButton}
            onPress={makePrediction}
            disabled={loading}
          >
            <LinearGradient colors={['#34443D', '#67775E']} style={styles.buttonGradient}>
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>🔮 Predict Purchase Behavior</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Prediction Result */}
          {prediction && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>🎯 Prediction Result</Text>
              <Text style={styles.resultText}>
                Will Buy Eco-Friendly: {prediction.will_buy ? '✅ Yes' : '❌ No'}
              </Text>
              <Text style={styles.confidenceText}>
                Confidence: {(prediction.confidence_score * 100).toFixed(1)}%
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34443D',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#67775E',
    textAlign: 'center',
    marginTop: 5,
  },
  form: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34443D',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#67775E',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34443D',
    marginBottom: 10,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderButton: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#67775E',
  },
  sliderButtonActive: {
    backgroundColor: '#34443D',
  },
  sliderButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34443D',
  },
  sliderButtonTextActive: {
    color: 'white',
  },
  predictButton: {
    marginTop: 30,
    borderRadius: 15,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#34443D',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34443D',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 18,
    color: '#67775E',
    textAlign: 'center',
    marginBottom: 5,
  },
  confidenceText: {
    fontSize: 16,
    color: '#34443D',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default MLPredictionScreen;