import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions, Animated, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Searchbar, IconButton, Button, Avatar, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const categories = ['All', 'Arms', 'Legs', 'Chest', 'Back', 'Core', 'Full Body', 'Cardio'];

export default function WorkoutsScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [cardScales, setCardScales] = useState([]);

  useEffect(() => {
    loadWorkouts();
    animateEntrance();
  }, []);

  useEffect(() => {
    setCardScales(workouts.map(() => new Animated.Value(1)));
  }, [workouts]);

  useEffect(() => {
    // Reset category to 'All' when search query changes
    setSelectedCategory('All');
  }, [searchQuery]);

  const loadWorkouts = async () => {
    try {
      const savedWorkouts = await AsyncStorage.getItem('workouts');
      if (savedWorkouts !== null) {
        const parsedWorkouts = JSON.parse(savedWorkouts);
        console.log('Loaded workouts:', parsedWorkouts);
        setWorkouts(parsedWorkouts);
      } else {
        // Initial workouts data
        const initialWorkouts = [
          { id: 1, name: 'Full Body Workout', duration: '45 min', difficulty: 'Intermediate', icon: 'weight-lifter', saved: false, category: 'Full Body' },
          { id: 2, name: 'HIIT Cardio', duration: '30 min', difficulty: 'Advanced', icon: 'run-fast', saved: false, category: 'Cardio' },
          { id: 3, name: 'Yoga Flow', duration: '60 min', difficulty: 'Beginner', icon: 'yoga', saved: false, category: 'Full Body' },
          { id: 4, name: 'Arm Blaster', duration: '40 min', difficulty: 'Intermediate', icon: 'arm-flex', saved: false, category: 'Arms' },
          { id: 5, name: 'Leg Day', duration: '50 min', difficulty: 'Advanced', icon: 'human-handsdown', saved: false, category: 'Legs' },
          { id: 6, name: 'Core Crusher', duration: '20 min', difficulty: 'Advanced', icon: 'ab-testing', saved: false, category: 'Core' },
          { id: 7, name: 'Chest Workout', duration: '45 min', difficulty: 'Intermediate', icon: 'human', saved: false, category: 'Chest' },
          { id: 8, name: 'Back and Biceps', duration: '55 min', difficulty: 'Intermediate', icon: 'human-handsup', saved: false, category: 'Back' },
        ];
        console.log('Initial workouts:', initialWorkouts);
        setWorkouts(initialWorkouts);
        await AsyncStorage.setItem('workouts', JSON.stringify(initialWorkouts));
      }
    } catch (error) {
      console.error('Error loading workouts:', error);
    }
  };

  const animateEntrance = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const onChangeSearch = useCallback((query) => setSearchQuery(query), []);

  const filteredWorkouts = useMemo(() => {
    return workouts.filter(workout => {
      const matchesSearch = workout.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || workout.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [workouts, searchQuery, selectedCategory]);

  const saveWorkout = useCallback(async (id) => {
    const updatedWorkouts = workouts.map(workout =>
      workout.id === id ? { ...workout, saved: !workout.saved } : workout
    );
    setWorkouts(updatedWorkouts);
    try {
      await AsyncStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  }, [workouts]);

  const getDifficultyColor = useCallback((difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return '#E8F5E9'; // Light Green 50
      case 'Intermediate':
        return '#E3F2FD'; // Light Blue 50
      case 'Advanced':
        return '#FBE9E7'; // Light Deep Orange 50
      default:
        return '#F3E5F5'; // Light Purple 50
    }
  }, []);

  const renderWorkoutCard = useCallback((workout, index) => {
    if (!cardScales[index]) return null;

    console.log('Rendering workout:', workout);

    const animatePress = () => {
      Animated.sequence([
        Animated.timing(cardScales[index], { toValue: 0.98, duration: 100, useNativeDriver: true }),
        Animated.spring(cardScales[index], { toValue: 1, friction: 3, useNativeDriver: true }),
      ]).start();
    };

    return (
      <Animated.View
        key={workout.id}
        style={[
          styles.cardContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity onPress={animatePress} activeOpacity={0.9}>
          <Animated.View style={{ transform: [{ scale: cardScales[index] }] }}>
            <Card style={styles.workoutCard}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.workoutHeader}>
                  <Avatar.Icon size={36} icon={workout.icon} style={[styles.workoutIcon, { backgroundColor: getDifficultyColor(workout.difficulty) }]} color="#1E88E5" />
                  <View style={styles.workoutInfo}>
                    <Title style={styles.workoutTitle}>{workout.name}</Title>
                    <Paragraph style={styles.workoutDetails}>
                      <MaterialCommunityIcons name="clock-outline" size={12} color="#757575" /> {workout.duration} {' '}
                      <MaterialCommunityIcons name="speedometer" size={12} color="#757575" /> {workout.difficulty} {' '}
                      <MaterialCommunityIcons name="tag" size={12} color="#757575" /> {'Arms'}
                    </Paragraph>
                  </View>
                  <IconButton
                    icon={workout.saved ? "heart" : "heart-outline"}
                    color="#FF5252"
                    size={24}
                    onPress={() => saveWorkout(workout.id)}
                    style={styles.saveButton}
                  />
                </View>
                <Button 
                  icon="play-circle-outline" 
                  mode="contained" 
                  onPress={() => console.log(`Start ${workout.name}`)}
                  style={styles.startButton}
                  labelStyle={styles.buttonLabel}
                >
                  Start Workout
                </Button>
              </Card.Content>
            </Card>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }, [fadeAnim, scaleAnim, saveWorkout, getDifficultyColor, cardScales]);

  const renderCategoryChips = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryContainer}
    >
      {categories.map((category) => (
        <Chip
          key={category}
          selected={category === selectedCategory}
          onPress={() => setSelectedCategory(category)}
          style={styles.categoryChip}
          textStyle={styles.categoryChipText}
        >
          {category}
        </Chip>
      ))}
    </ScrollView>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1A1B25', '#2D2E3D']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Title style={styles.headerText}>Workouts</Title>
          <View style={styles.headerRightContent}>
            <TouchableOpacity style={styles.askAIButton} onPress={() => navigation.navigate('ChatScreen')}>
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

      <Searchbar
        placeholder="Search workouts"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
        icon={() => <MaterialCommunityIcons name="magnify" size={24} color="#757575" />}
      />

      {renderCategoryChips()}

      {filteredWorkouts.map((workout, index) => renderWorkoutCard(workout, index))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13141C',
  },
  header: {
    padding: 16,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  searchBar: {
    margin: 12,
    borderRadius: 12,
    elevation: 1,
    backgroundColor: '#2C2F48',
  },
  searchInput: {
    fontSize: 16,
  },
  categoryContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#2D3250',
  },
  categoryChipText: {
    color: '#9397FF',
  },
  cardContainer: {
    marginBottom: 8,
  },
  workoutCard: {
    marginHorizontal: 12,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#1A1B25',
  },
  cardContent: {
    padding: 12,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutIcon: {
    marginRight: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  workoutDetails: {
    marginTop: 2,
    color: '#757575',
    fontSize: 12,
  },
  saveButton: {
    margin: 0,
  },
  startButton: {
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: '#1E88E5',
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
});