import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Card, Title, Paragraph, Avatar, ProgressBar, Button, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function SleepScreen() {
  const [sleepData, setSleepData] = useState({
    current: 7,
    goal: 8,
    weeklyData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{ data: [6.5, 7, 7.5, 8, 7, 6, 7.5] }],
    },
  });

  useEffect(() => {
    // Fetch sleep data here
  }, []);

  const renderSleepCard = () => (
    <View style={styles.sleepCard}>
      <LinearGradient
        colors={['#9C27B0', '#7B1FA2']}
        style={styles.sleepCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Card.Content>
          <View style={styles.sleepCardHeader}>
            <Avatar.Icon size={40} icon="sleep" style={styles.sleepCardIcon} />
            <Title style={styles.sleepCardTitle}>Daily Sleep</Title>
          </View>
          <View style={styles.sleepMetricContainer}>
            <Text style={styles.sleepMetricText}>
              {sleepData.current.toFixed(1)} / {sleepData.goal.toFixed(1)} hrs
            </Text>
          </View>
          <ProgressBar 
            progress={sleepData.current / sleepData.goal} 
            color="#FFFFFF" 
            style={styles.sleepProgressBar} 
          />
          <Text style={styles.sleepProgressText}>
            {((sleepData.current / sleepData.goal) * 100).toFixed(0)}% of daily goal
          </Text>
        </Card.Content>
      </LinearGradient>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#9C27B0', '#7B1FA2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Sleep Tracker</Text>
          <IconButton
            icon="account-circle"
            color="#FFFFFF"
            size={24}
            onPress={() => console.log('Profile pressed')}
            style={styles.profileIcon}
          />
        </View>
      </LinearGradient>
      
      {renderSleepCard()}

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
            data={sleepData.weeklyData}
            width={width - 60}
            height={220}
            yAxisSuffix=" hrs"
            chartConfig={{
              backgroundColor: '#FFFFFF',
              backgroundGradientFrom: '#FFFFFF',
              backgroundGradientTo: '#FFFFFF',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              barPercentage: 0.7,
            }}
            style={styles.chart}
          />
          <View style={styles.chartFooter}>
            <Text style={styles.chartFooterText}>Average: 7.1 hrs</Text>
            <Text style={styles.chartFooterText}>Total: 49.5 hrs</Text>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          icon="bed"
          onPress={() => console.log('Log Sleep pressed')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Log Sleep
        </Button>
        <Button
          mode="contained"
          icon="chart-timeline-variant"
          onPress={() => console.log('Sleep Analysis pressed')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Sleep Analysis
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
  sleepCard: {
    margin: 15,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
  },
  sleepCardGradient: {
    padding: 20,
  },
  sleepCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sleepCardIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sleepCardTitle: {
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sleepMetricContainer: {
    marginBottom: 15,
  },
  sleepMetricText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'left',
  },
  sleepProgressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  sleepProgressText: {
    color: '#FFFFFF',
    marginTop: 5,
    fontSize: 14,
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
    backgroundColor: '#9C27B0',
  },
  buttonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});