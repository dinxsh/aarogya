import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Provider as PaperProvider, Card, Title, Avatar, ProgressBar, Button, IconButton, Checkbox, FAB, Portal, Modal, TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function GoalsScreen() {
  const [goalsData, setGoalsData] = useState({
    completed: 3,
    total: 5,
    goals: [
      { id: 1, title: 'Run 5km', completed: false, icon: 'run', category: 'Fitness' },
      { id: 2, title: 'Meditate for 10 minutes', completed: true, icon: 'meditation', category: 'Wellness' },
      { id: 3, title: 'Drink 2L of water', completed: false, icon: 'water', category: 'Health' },
      { id: 4, title: 'Read for 30 minutes', completed: false, icon: 'book-open-variant', category: 'Personal' },
      { id: 5, title: 'Sleep for 8 hours', completed: true, icon: 'sleep', category: 'Health' },
    ],
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', category: '', icon: 'flag' });

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

  const addNewGoal = () => {
    if (newGoal.title.trim() === '') return;
    const updatedGoals = [
      ...goalsData.goals,
      { id: Date.now(), ...newGoal, completed: false },
    ];
    setGoalsData({
      ...goalsData,
      goals: updatedGoals,
      total: updatedGoals.length,
    });
    setNewGoal({ title: '', category: '', icon: 'flag' });
    setModalVisible(false);
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

  const renderGoalItem = (goal) => (
    <TouchableOpacity key={goal.id} onPress={() => toggleGoalCompletion(goal.id)}>
      <Card style={[styles.goalItem, goal.completed && styles.completedGoalItem]}>
        <Card.Content style={styles.goalItemContent}>
          <Avatar.Icon size={40} icon={goal.icon} style={styles.goalIcon} color="#4CAF50" />
          <View style={styles.goalTextContainer}>
            <Text style={[styles.goalTitle, goal.completed && styles.completedGoalText]}>{goal.title}</Text>
            <Text style={styles.goalCategory}>{goal.category}</Text>
          </View>
          <Checkbox
            status={goal.completed ? 'checked' : 'unchecked'}
            color="#4CAF50"
          />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <ScrollView>
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
                size={28}
                onPress={() => console.log('Profile pressed')}
              />
            </View>
          </LinearGradient>
          
          {renderGoalsCard()}

          <View style={styles.goalsListContainer}>
            {goalsData.goals.map(renderGoalItem)}
          </View>
        </ScrollView>

        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
            <Title style={styles.modalTitle}>Add New Goal</Title>
            <TextInput
              label="Goal Title"
              value={newGoal.title}
              onChangeText={(text) => setNewGoal({ ...newGoal, title: text })}
              style={styles.input}
            />
            <TextInput
              label="Category"
              value={newGoal.category}
              onChangeText={(text) => setNewGoal({ ...newGoal, category: text })}
              style={styles.input}
            />
            <TextInput
              label="Icon (MaterialCommunityIcons name)"
              value={newGoal.icon}
              onChangeText={(text) => setNewGoal({ ...newGoal, icon: text })}
              style={styles.input}
            />
            <Button mode="contained" onPress={addNewGoal} style={styles.addButton}>
              Add Goal
            </Button>
          </Modal>
        </Portal>

        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => setModalVisible(true)}
        />
      </View>
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
  goalsListContainer: {
    padding: 15,
  },
  goalItem: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  completedGoalItem: {
    opacity: 0.7,
  },
  goalItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalIcon: {
    backgroundColor: '#E8F5E9',
    marginRight: 15,
  },
  goalTextContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  goalCategory: {
    fontSize: 12,
    color: '#757575',
  },
  completedGoalText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4CAF50',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
  },
});