import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Card, Title, Avatar, ProgressBar, Button, IconButton, Checkbox } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function GoalsScreen() {
  const [goalsData, setGoalsData] = useState({
    completed: 3,
    total: 5,
    goals: [
      { id: 1, title: 'Run 5km', completed: false, icon: 'run' },
      { id: 2, title: 'Meditate for 10 minutes', completed: true, icon: 'meditation' },
      { id: 3, title: 'Drink 2L of water', completed: false, icon: 'water' },
      { id: 4, title: 'Read for 30 minutes', completed: false, icon: 'book-open-variant' },
      { id: 5, title: 'Sleep for 8 hours', completed: true, icon: 'sleep' },
    ],
  });

  useEffect(() => {
    // Fetch goals data here
  }, []);

  const toggleGoalCompletion = (id) => {
    const updatedGoals = goalsData.goals.map(goal =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    );
    const completed = updatedGoals.filter(goal => goal.completed).length;
    setGoalsData({ ...goalsData, goals: updatedGoals, completed });
  };

  const renderGoalsCard = () => (
    <Card style={styles.goalsCard}>
      <LinearGradient
        colors={['#4CAF50', '#45A049']}
        style={styles.goalsCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Card.Content>
          <View style={styles.goalsCardHeader}>
            <Avatar.Icon size={40} icon="flag-checkered" style={styles.goalsCardIcon} />
            <Title style={styles.goalsCardTitle}>Daily Goals</Title>
          </View>
          <Text style={styles.goalsMetricText}>
            {goalsData.completed} / {goalsData.total} Completed
          </Text>
          <ProgressBar 
            progress={goalsData.completed / goalsData.total} 
            color="#FFFFFF" 
            style={styles.goalsProgressBar} 
          />
        </Card.Content>
      </LinearGradient>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#45A049']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Goals Tracker</Text>
          <IconButton
            icon="account-circle"
            color="#FFFFFF"
            size={24}
            onPress={() => console.log('Profile pressed')}
          />
        </View>
      </LinearGradient>
      
      {renderGoalsCard()}

      <Card style={styles.goalsListCard}>
        <Card.Content>
          {goalsData.goals.map((goal) => (
            <View key={goal.id} style={styles.goalItem}>
              <Checkbox
                status={goal.completed ? 'checked' : 'unchecked'}
                onPress={() => toggleGoalCompletion(goal.id)}
                color="#4CAF50"
              />
              <Avatar.Icon size={24} icon={goal.icon} style={styles.goalIcon} />
              <Text style={[styles.goalTitle, goal.completed && styles.completedGoal]}>{goal.title}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        icon="plus"
        onPress={() => console.log('Add Goal pressed')}
        style={styles.addButton}
        labelStyle={styles.buttonLabel}
      >
        Add Goal
      </Button>
    </ScrollView>
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
  goalsCard: {
    margin: 15,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
  },
  goalsCardGradient: {
    padding: 20,
  },
  goalsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  goalsCardIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  goalsCardTitle: {
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  goalsMetricText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  goalsProgressBar: {
    height: 8,
    borderRadius: 4,
  },
  goalsListCard: {
    margin: 15,
    borderRadius: 20,
    elevation: 4,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalIcon: {
    backgroundColor: '#E8F5E9',
    marginRight: 10,
  },
  goalTitle: {
    flex: 1,
    fontSize: 16,
  },
  completedGoal: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  addButton: {
    margin: 15,
    backgroundColor: '#4CAF50',
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});