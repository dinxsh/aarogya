import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Card, Title, Paragraph, Avatar, ProgressBar, Button, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function CaloriesScreen() {
  const [caloriesData, setCaloriesData] = useState({
    consumed: 1800,
    burned: 500,
    goal: 2000,
    weeklyData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{ data: [1900, 2100, 1800, 2200, 1950, 2050, 1800] }],
    },
  });

  useEffect(() => {
    // Fetch calories data here
  }, []);

  const renderCaloriesCard = () => (
    <View style={styles.caloriesCard}>
      <LinearGradient
        colors={['#FF5722', '#F4511E']}
        style={styles.caloriesCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Card.Content>
          <View style={styles.caloriesCardHeader}>
            <Avatar.Icon size={40} icon="fire" style={styles.caloriesCardIcon} />
            <Title style={styles.caloriesCardTitle}>Daily Calories</Title>
          </View>
          <View style={styles.caloriesMetricContainer}>
            <Text style={styles.caloriesMetricText}>
              {caloriesData.consumed.toLocaleString()} / {caloriesData.goal.toLocaleString()} kcal
            </Text>
          </View>
          <ProgressBar 
            progress={caloriesData.consumed / caloriesData.goal} 
            color="#FFFFFF" 
            style={styles.caloriesProgressBar} 
          />
          <Text style={styles.caloriesProgressText}>
            {((caloriesData.consumed / caloriesData.goal) * 100).toFixed(0)}% of daily goal
          </Text>
          <View style={styles.caloriesCountContainer}>
            <Text style={styles.caloriesCountText}>Calories consumed: {caloriesData.consumed}</Text>
            <Text style={styles.caloriesCountText}>Calories burned: {caloriesData.burned}</Text>
          </View>
        </Card.Content>
      </LinearGradient>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#FF5722', '#F4511E']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Calorie Tracker</Text>
          <IconButton
            icon="account-circle"
            color="#FFFFFF"
            size={24}
            onPress={() => console.log('Profile pressed')}
            style={styles.profileIcon}
          />
        </View>
      </LinearGradient>
      
      {renderCaloriesCard()}

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
            data={caloriesData.weeklyData}
            width={width - 60}
            height={220}
            yAxisSuffix=" kcal"
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 87, 34, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              barPercentage: 0.7,
            }}
            style={styles.chart}
          />
          <View style={styles.chartFooter}>
            <Text style={styles.chartFooterText}>Average: 1,971 kcal</Text>
            <Text style={styles.chartFooterText}>Total: 13,800 kcal</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          icon="food-apple"
          onPress={() => console.log('Log Food pressed')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Log Food
        </Button>
        <Button
          mode="contained"
          icon="run"
          onPress={() => console.log('Log Exercise pressed')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Log Exercise
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
  caloriesCard: {
    margin: 15,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
  },
  caloriesCardGradient: {
    padding: 20,
  },
  caloriesCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  caloriesCardIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  caloriesCardTitle: {
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  caloriesMetricContainer: {
    marginBottom: 15,
  },
  caloriesMetricText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'left',
  },
  caloriesProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  caloriesProgressText: {
    color: '#FFFFFF',
    marginTop: 5,
    fontSize: 14,
  },
  caloriesCountContainer: {
    marginTop: 15,
  },
  caloriesCountText: {
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
    backgroundColor: '#FF5722',
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});