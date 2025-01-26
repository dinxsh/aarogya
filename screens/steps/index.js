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
        colors={['#2C2F48', '#363B64']}
        style={styles.stepsCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Card.Content>
          <View style={styles.stepsCardHeader}>
            <Avatar.Icon size={40} icon="walk" style={styles.stepsCardIcon} color="#9397FF" />
            <Title style={styles.stepsCardTitle}>Daily Steps</Title>
          </View>
          <View style={styles.stepsMetricContainer}>
            <Text style={styles.stepsMetricText}>
              {stepsData.current.toLocaleString()} / {stepsData.goal.toLocaleString()}
            </Text>
          </View>
          <ProgressBar 
            progress={stepsData.current / stepsData.goal} 
            color="#9397FF" 
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
        colors={['#13141C', '#1A1B25', '#2D2E3D']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Steps Tracker</Text>
          <IconButton
            icon="account-circle"
            color="#9397FF"
            size={24}
            onPress={() => console.log('Profile pressed')}
            style={styles.profileIcon}
          />
        </View>
      </LinearGradient>
      
      {renderStepsCard()}

      <Card style={styles.chartCard}>
        <LinearGradient
          colors={['#2C2F48', '#363B64']}
          style={styles.chartCardGradient}
        >
          <Card.Content>
            <View style={styles.chartHeader}>
              <Title style={styles.chartTitle}>Overview</Title>
              <IconButton
                icon="information-outline"
                size={20}
                onPress={() => console.log('Info pressed')}
                color="#9397FF"
              />
            </View>
            <BarChart
              data={stepsData.weeklyData}
              width={width - 60}
              height={220}
              yAxisSuffix=" steps"
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: 'transparent',
                backgroundGradientTo: 'transparent',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(147, 151, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
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
        </LinearGradient>
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
    backgroundColor: '#13141C',
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
    backgroundColor: 'rgba(147, 151, 255, 0.15)',
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
    backgroundColor: 'rgba(147, 151, 255, 0.2)',
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
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  chartCardGradient: {
    borderRadius: 20,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartTitle: {
    color: '#FFFFFF',
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
    color: 'rgba(255, 255, 255, 0.6)',
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
    backgroundColor: 'rgba(147, 151, 255, 0.15)',
  },
  buttonLabel: {
    color: '#9397FF',
    fontSize: 16,
  },
});