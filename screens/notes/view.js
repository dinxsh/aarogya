import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card, Title, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HealthDashboardScreen() {
  const [healthMetrics, setHealthMetrics] = useState({
    steps: { current: 8500, goal: 10000 },
    calories: { burned: 2100, consumed: 1800, goal: 2000 },
    water: { current: 1.5, goal: 2.5 },
    sleep: { current: 7, goal: 8 },
  });

  const [weightData, setWeightData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ data: [80, 79.5, 79.8, 79.2, 78.9, 78.5, 78.7] }],
  });

  useEffect(() => {
    // Fetch health metrics data here
  }, []);

  const renderMetricCard = (title, icon, current, goal, unit) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name={icon} size={24} color="#4CAF50" />
          <Title style={styles.cardTitle}>{title}</Title>
        </View>
        <Paragraph style={styles.metricText}>
          {current} / {goal} {unit}
        </Paragraph>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${(current / goal) * 100}%` }]} />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Health Dashboard</Text>
      
      <View style={styles.cardContainer}>
        {renderMetricCard('Steps', 'walk', healthMetrics.steps.current, healthMetrics.steps.goal, 'steps')}
        {renderMetricCard('Calories', 'fire', healthMetrics.calories.burned, healthMetrics.calories.goal, 'kcal')}
        {renderMetricCard('Water', 'cup-water', healthMetrics.water.current, healthMetrics.water.goal, 'L')}
        {renderMetricCard('Sleep', 'sleep', healthMetrics.sleep.current, healthMetrics.sleep.goal, 'hrs')}
      </View>

      <Card style={styles.chartCard}>
        <Card.Content>
          <Title style={styles.chartTitle}>Weight Trend</Title>
          <LineChart
            data={weightData}
            width={width - 60}
            height={220}
            chartConfig={{
              backgroundColor: '#1E1E1E',
              backgroundGradientFrom: '#1E1E1E',
              backgroundGradientTo: '#1E1E1E',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#4CAF50',
              },
            }}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 15,
    backgroundColor: '#1E1E1E',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    marginLeft: 10,
    color: '#FFFFFF',
  },
  metricText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333333',
    borderRadius: 3,
  },
  progress: {
    height: 6,
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  chartCard: {
    marginTop: 20,
    backgroundColor: '#1E1E1E',
  },
  chartTitle: {
    color: '#FFFFFF',
    marginBottom: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});