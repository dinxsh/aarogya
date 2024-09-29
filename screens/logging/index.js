import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList, Dimensions, Modal } from 'react-native';
import { Provider as PaperProvider, Card, Title, Paragraph, TextInput, DataTable, Chip, Button, List, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { debounce } from 'lodash';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const NUTRITIONIX_APP_ID = '5129d2e0';
const NUTRITIONIX_API_KEY = '379bd4c85481e29f7f7650dc811f9a13';
const { width } = Dimensions.get('window');

// New component for the header
const ScreenHeader = ({ title, gradientColors }) => {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.headerContent}>
        <Text style={styles.headerText}>{title}</Text>
        <View style={styles.headerRightContent}>
          <TouchableOpacity 
            style={styles.askAIButton} 
            onPress={() => navigation.navigate('ChatScreen')}
          >
            <Text style={styles.askAIButtonText}>Ask AI</Text>
          </TouchableOpacity>
          <IconButton
            icon="account-circle"
            color="#FFFFFF"
            size={28}
            onPress={() => console.log('Profile pressed')}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

export default function FoodLoggingScreen() {
  const navigation = useNavigation();
  const [foodQuery, setFoodQuery] = useState('');
  const [foodSuggestions, setFoodSuggestions] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loggedFoods, setLoggedFoods] = useState([]);

  const debouncedSearch = debounce(async (query) => {
    if (query.trim() === '') {
      setFoodSuggestions([]);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://trackapi.nutritionix.com/v2/search/instant?query=${query}`, {
        headers: {
          'x-app-id': NUTRITIONIX_APP_ID,
          'x-app-key': NUTRITIONIX_API_KEY,
        },
      });
      const data = await response.json();
      setFoodSuggestions(data.common.slice(0, 5));
    } catch (err) {
      setError('Error fetching food suggestions. Please try again.');
      console.error(err);
    }
    setLoading(false);
  }, 300);

  useEffect(() => {
    debouncedSearch(foodQuery);
  }, [foodQuery]);

  const fetchNutrients = async (foodName) => {
    setLoading(true);   
    setError('');
    try {
      const response = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
        method: 'POST',
        headers: {
          'x-app-id': NUTRITIONIX_APP_ID,
          'x-app-key': NUTRITIONIX_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: foodName }),
      });
      const data = await response.json();
      if (data.foods && data.foods.length > 0) {
        setSelectedFood(data.foods[0]);
        setFoodSuggestions([]);
      } else {
        setError('No nutrient data found for this food.');
      }
    } catch (err) {
      setError('Error fetching nutrient data. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };

  const renderFoodSuggestion = ({ item }) => (
    <TouchableOpacity onPress={() => {
      setFoodQuery(item.food_name);
      fetchNutrients(item.food_name);
    }}>
      <Chip icon="food" style={styles.suggestionChip} mode="outlined">{item.food_name}</Chip>
    </TouchableOpacity>
  );

  const renderNutrientTable = () => (
    <Card style={styles.nutrientCard} elevation={4}>
      <Card.Content>
        <Title style={styles.nutrientTitle}>Nutrition Facts</Title>
        <Paragraph style={styles.servingSize}>Serving size: {selectedFood.serving_qty} {selectedFood.serving_unit}</Paragraph>
        <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title>Nutrient</DataTable.Title>
            <DataTable.Title numeric>Amount</DataTable.Title>
            <DataTable.Title numeric>Goal</DataTable.Title>
            <DataTable.Title numeric>Completed</DataTable.Title>
          </DataTable.Header>
          {[
            { name: 'Calories', value: selectedFood.nf_calories, unit: 'kcal', goal: 2000 },
            { name: 'Total Fat', value: selectedFood.nf_total_fat, unit: 'g', goal: 65 },
            { name: 'Saturated Fat', value: selectedFood.nf_saturated_fat, unit: 'g', goal: 20 },
            { name: 'Cholesterol', value: selectedFood.nf_cholesterol, unit: 'mg', goal: 300 },
            { name: 'Sodium', value: selectedFood.nf_sodium, unit: 'mg', goal: 2400 },
            { name: 'Total Carbohydrate', value: selectedFood.nf_total_carbohydrate, unit: 'g', goal: 300 },
            { name: 'Dietary Fiber', value: selectedFood.nf_dietary_fiber, unit: 'g', goal: 25 },
            { name: 'Sugars', value: selectedFood.nf_sugars, unit: 'g', goal: 50 },
            { name: 'Protein', value: selectedFood.nf_protein, unit: 'g', goal: 50 },
            { name: 'Potassium', value: selectedFood.nf_potassium, unit: 'mg', goal: 3500 },
          ].map((nutrient, index) => (
            <DataTable.Row key={index} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
              <DataTable.Cell>{nutrient.name}</DataTable.Cell>
              <DataTable.Cell numeric>{nutrient.value.toFixed(1)} {nutrient.unit}</DataTable.Cell>
              <DataTable.Cell numeric>{nutrient.goal} {nutrient.unit}</DataTable.Cell>
              <DataTable.Cell numeric>{((nutrient.value / nutrient.goal) * 100).toFixed(1)}%</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Card.Content>
    </Card>
  );

  const logFood = async () => {
    if (selectedFood) {
      try {
        const existingFoods = await AsyncStorage.getItem('loggedFoods');
        let foodsArray = existingFoods ? JSON.parse(existingFoods) : [];
        
        foodsArray.push({
          ...selectedFood,
          loggedAt: new Date().toISOString()
        });
        
        await AsyncStorage.setItem('loggedFoods', JSON.stringify(foodsArray));
        console.log('Food logged successfully');
        // You might want to add some user feedback here, like a success message
      } catch (error) {
        console.error('Error saving food:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  const showLoggedFoods = async () => {
    try {
      const existingFoods = await AsyncStorage.getItem('loggedFoods');
      if (existingFoods) {
        setLoggedFoods(JSON.parse(existingFoods));
        setModalVisible(true);
      } else {
        setError('No logged foods found');
      }
    } catch (error) {
      console.error('Error fetching logged foods:', error);
      setError('Error fetching logged foods');
    }
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <ScreenHeader title="Food Logging" gradientColors={['#4CAF50', '#45a049']} />

        <Card style={styles.searchCard} elevation={4}>
          <Card.Content>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={24} color="#4CAF50" style={styles.searchIcon} />
              <TextInput
                placeholder="Search food"
                value={foodQuery}
                onChangeText={setFoodQuery}
                style={styles.input}
                right={foodQuery ? <TextInput.Icon name="close" onPress={() => setFoodQuery('')} color="#4CAF50" /> : null}
                theme={{ colors: { primary: '#4CAF50' } }}
              />
            </View>
          </Card.Content>
        </Card>

        {foodSuggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={foodSuggestions}
              renderItem={renderFoodSuggestion}
              keyExtractor={(item) => item.food_name}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        {loading && <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />}

        {error !== '' && <Text style={styles.errorText}>{error}</Text>}

        {selectedFood && (
          <Card style={styles.resultCard} elevation={4}>
            <Card.Content>
              <View style={styles.foodHeader}>
                <Title style={styles.foodTitle}>{selectedFood.food_name}</Title>
                <Paragraph style={styles.brandName}>{selectedFood.brand_name || 'Generic'}</Paragraph>
              </View>
              {renderNutrientTable()}
              <Button
                mode="contained"
                onPress={logFood}
                style={styles.logButton}
                labelStyle={styles.logButtonLabel}
              >
                Log Food
              </Button>
            </Card.Content>
          </Card>
        )}

        <Button
          mode="outlined"
          onPress={showLoggedFoods}
          style={styles.showLoggedFoodsButton}
          labelStyle={styles.showLoggedFoodsButtonLabel}
        >
          Show Logged Foods
        </Button>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Title style={styles.modalTitle}>Logged Foods</Title>
              <ScrollView style={styles.modalScrollView}>
                {loggedFoods.map((food, index) => (
                  <List.Item
                    key={index}
                    title={food.food_name}
                    description={`Calories: ${food.nf_calories.toFixed(1)} kcal | Logged: ${new Date(food.loggedAt).toLocaleString()}`}
                    left={props => <List.Icon {...props} icon="food" />}
                  />
                ))}
              </ScrollView>
              <Button onPress={() => setModalVisible(false)}>Close</Button>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  askAIButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  askAIButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  searchCard: {
    margin: 16,
    borderRadius: 25,
    elevation: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingLeft: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    height: 50,
    fontSize: 16,
  },
  suggestionsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  suggestionChip: {
    marginRight: 8,
    backgroundColor: '#E8F5E9',
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  resultCard: {
    margin: 16,
    borderRadius: 10,
  },
  foodHeader: {
    marginBottom: 16,
  },
  foodTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  brandName: {
    fontSize: 16,
    color: '#666',
  },
  nutrientCard: {
    marginTop: 16,
    borderRadius: 10,
  },
  nutrientTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4CAF50',
  },
  servingSize: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  tableHeader: {
    backgroundColor: '#E8F5E9',
  },
  evenRow: {
    backgroundColor: '#FFFFFF',
  },
  oddRow: {
    backgroundColor: '#F9FBE7',
  },
  logButton: {
    marginTop: 16,
    backgroundColor: '#4CAF50',
  },
  logButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  showLoggedFoodsButton: {
    margin: 16,
    borderColor: '#4CAF50',
  },
  showLoggedFoodsButtonLabel: {
    color: '#4CAF50',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalScrollView: {
    width: '100%',
    marginBottom: 20,
  },
});