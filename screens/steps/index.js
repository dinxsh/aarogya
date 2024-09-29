import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Card, Title, Paragraph, Avatar, ProgressBar, Button, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function StepsScreen() {
  const navigation = useNavigation();
  const [stepsData, setStepsData] = useState({
    current: 8500,
    goal: 10000,
    weeklyData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{ data: [7500, 8200, 7800, 9100, 8500, 10200, 8500] }],
    },
  });

  useEffect(() => {
    // Fetch steps data here
  }, []);

  const renderStepsCard = () => (
    <View style={styles.stepsCard}>
      <LinearGradient
        colors={['#1E88E5', '#1565C0']}
        style={styles.stepsCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Card.Content>
          <View style={styles.stepsCardHeader}>
            <Avatar.Icon size={40} icon="walk" style={styles.stepsCardIcon} />
            <Title style={styles.stepsCardTitle}>Daily Steps</Title>
          </View>
          <View style={styles.stepsMetricContainer}>
            <Text style={styles.stepsMetricText}>
              {stepsData.current.toLocaleString()} / {stepsData.goal.toLocaleString()}
            </Text>
          </View>
          <ProgressBar 
            progress={stepsData.current / stepsData.goal} 
            color="#FFFFFF" 
            style={styles.stepsProgressBar} 
          />
          <Text style={styles.stepsProgressText}>
            {((stepsData.current / stepsData.goal) * 100).toFixed(0)}% of daily goal
          </Text>
          <View style={styles.stepsCountContainer}>
            <Text style={styles.stepsCountText}>Steps taken today: {stepsData.current}</Text>
            <Text style={styles.stepsCountText}>Steps remaining: {stepsData.goal - stepsData.current}</Text>
          </View>
        </Card.Content>
      </LinearGradient>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#2196F3', '#1976D2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Steps Tracker</Text>
          <IconButton
            icon="account-circle"
            color="#FFFFFF"
            size={24}
            onPress={() => console.log('Profile pressed')}
            style={styles.profileIcon}
          />
        </View>
      </LinearGradient>
      
      {renderStepsCard()}

      <Card style={styles.chartCard}>
        <Card.Content>
          <View style={styles.chartHeader}>
            <Title style={styles.chartTitle}>Weekly Overview</Title>
            <IconButton
              icon="information-outline"
              size={20}
              onPress={() => console.log('Info pressed')}
              color="#666"
            />
          </View>
          <BarChart
            data={stepsData.weeklyData}
            width={width - 60}
            height={220}
            yAxisSuffix=" steps"
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              barPercentage: 0.7,
            }}
            style={styles.chart}
          />
          <View style={styles.chartFooter}>
            <Text style={styles.chartFooterText}>Average: 8,543 steps</Text>
            <Text style={styles.chartFooterText}>Total: 59,800 steps</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          icon="target"
          onPress={() => navigation.navigate('GoalsScreen')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Set Goal
        </Button>
        <Button
          mode="contained"
          icon="history"
          onPress={() => console.log('View History pressed')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          View History
        </Button>
      </View>
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
  profileIcon: {
    margin: 0,
  },
  stepsCard: {
    margin: 15,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
  },
  stepsCardGradient: {
    padding: 20,
  },
  stepsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepsCardIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  stepsCardTitle: {
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  stepsMetricContainer: {
    marginBottom: 15,
  },
  stepsMetricText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'left',
  },
  stepsProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  stepsProgressText: {
    color: '#FFFFFF',
    marginTop: 5,
    fontSize: 14,
  },
  stepsCountContainer: {
    marginTop: 15,
  },
  stepsCountText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
  },
  chartCard: {
    margin: 15,
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  chartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  chartFooterText: {
    color: '#666',
    fontSize: 14,
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
    backgroundColor: '#2196F3',
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});