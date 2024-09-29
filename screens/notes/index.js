import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card, Title, Paragraph, Avatar, ProgressBar, Button, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function HealthDashboardScreen() {
  const navigation = useNavigation();
  const [healthMetrics, setHealthMetrics] = useState({
    steps: { current: 8500, goal: 10000 },
    calories: { burned: 2100, consumed: 1800, goal: 2000 },
    goals: { completed: 3, total: 5 },
    sleep: { current: 7, goal: 8 },
  });

  const [weightData, setWeightData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ data: [80, 79.5, 79.8, 79.2, 78.9, 78.5, 78.7] }],
  });

  useEffect(() => {
    // Fetch health metrics data here
  }, []);

  const renderMetricCard = (title, icon, current, goal, unit, color, screen) => (
    <TouchableOpacity style={styles.cardWrapper} onPress={() => navigation.navigate(screen)}>
      <LinearGradient
        colors={[color, color]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardHeader}>
          <Avatar.Icon size={40} icon={icon} style={[styles.cardIcon, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]} />
          <Title style={styles.cardTitle}>{title}</Title>
        </View>
        <Paragraph style={styles.metricText}>
          {current >= 1000 ? `${Math.floor(current / 1000)}k` : current} / {goal >= 1000 ? `${Math.floor(goal / 1000)}k` : goal} {unit}
        </Paragraph>
        <ProgressBar progress={current / goal} color="#FFFFFF" style={styles.progressBar} />
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        <LinearGradient
          colors={['#1E88E5', '#1976D2']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>Dashboard</Text>
            <View style={styles.headerRightContent}>
              <TouchableOpacity style={styles.askAIButton} onPress={() => navigation.navigate('ChatScreen')}>
                <Text style={styles.askAIButtonText}>Ask AI</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log('Profile pressed')}>
                <Image
                  source={require('../../assets/profile-image.jpg')}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        
        <View style={styles.cardContainer}>
          {renderMetricCard('Steps', 'walk', healthMetrics.steps.current, healthMetrics.steps.goal, 'steps', '#1E88E5', 'StepsScreen')}
          {renderMetricCard('Calories', 'fire', healthMetrics.calories.burned, healthMetrics.calories.goal, 'kcal', '#FF5722', 'CaloriesScreen')}
          {renderMetricCard('Goals', 'flag-checkered', healthMetrics.goals.completed, healthMetrics.goals.total, 'completed', '#4CAF50', 'GoalsScreen')}
          {renderMetricCard('Sleep', 'sleep', healthMetrics.sleep.current, healthMetrics.sleep.goal, 'hrs', '#9C27B0', 'SleepScreen')}

        </View>

        <Card style={styles.chartCard}>
          <Card.Content>
            <View style={styles.chartHeader}>
              <Title style={styles.chartTitle}>This Week</Title>
              <View style={styles.chartSummary}>
                <Text style={styles.chartSummaryText}>Avg: 79.2 kg</Text>
                <Text style={styles.chartSummaryText}>Change: -1.3 kg</Text>
              </View>
            </View>
            <LineChart
              data={weightData}
              width={width - 60}
              height={220}
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: { r: '3', strokeWidth: '2', stroke: '#1976D2' },
              }}
              bezier
              style={styles.chart}
              withInnerLines={false}
              withOuterLines={false}
            />
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            icon="plus"
            onPress={() => navigation.navigate('GoalsScreen')}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Add Goal
          </Button>
          <Button
            mode="contained"
            icon="notebook"
            onPress={() => console.log('Journal pressed')}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Journal
          </Button>
        </View>
      </ScrollView>
    </View>
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
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  card: {
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 16,
  },
  metricText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
  },
  chartCard: {
    margin: 15,
    marginTop: 0,
    borderRadius: 20,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTitle: {
    color: '#333333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chartSummary: {
    alignItems: 'flex-end',
  },
  chartSummaryText: {
    color: '#666',
    fontSize: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#1E88E5',
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});