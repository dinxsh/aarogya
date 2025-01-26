import React, { useState, useMemo, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, ImageBackground, Image } from 'react-native';
import { Avatar, Title, ProgressBar, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import Svg, { Circle, CircleProps, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { getFirestore, collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import NavbarComp from '../../components/nav';
const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.7;
const CIRCLE_STROKE = 12;

export default function FitnessDashboardScreen() {
  const navigation = useNavigation();
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium, 
    Inter_600SemiBold,
    Inter_700Bold
  });

  const [healthMetrics, setHealthMetrics] = useState({
    steps: { current: 1525, goal: 10 },
    calories: { burned: 2100, goal: 2500 },
    goals: { completed: 3, total: 5 },
    sleep: { current: 7, goal: 8 },
  });

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirestore();
    const auth = getAuth();
    
    // Fetch user's active challenges
    const challengesRef = collection(db, 'challenges');
    const q = query(
      challengesRef,
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(2) // Only fetch 2 challenges for the dashboard
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const challengesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        daysLeft: Math.ceil((doc.data().deadline.toDate() - new Date()) / (1000 * 60 * 60 * 24))
      }));
      
      // Add sample challenges if less than 2 challenges from Firebase
      const sampleChallenges = [
        {
          id: '1',
          title: '30 Day Running Challenge',
          image: require('../../assets/images/excercises/10k-steps-daily.png'),
          progress: 0,
          daysLeft: 30,
          category: 'Cardio',
          difficulty: 'Medium',
          participants: 245,
          prizeMoney: 5,
          status: 'active',
          createdAt: new Date()
        },
        {
          id: '2', 
          title: '100 Day Core',
          image: require('../../assets/images/excercises/100-day-core.png'),
          progress: 0,
          daysLeft: 28,
          category: 'Strength',
          difficulty: 'Easy',
          participants: 189,
          prizeMoney: 10,
          status: 'active',
          createdAt: new Date()
        }
      ];

      const combinedChallenges = [...challengesList];
      if (combinedChallenges.length < 2) {
        const neededSamples = 2 - combinedChallenges.length;
        combinedChallenges.push(...sampleChallenges.slice(0, neededSamples));
      }

      setChallenges(combinedChallenges);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const renderCircularProgress = () => {
    const percentage = (healthMetrics.steps.current / healthMetrics.steps.goal) * 100;
    const strokeDasharray = CIRCLE_SIZE * Math.PI;
    const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

    return (
      <View style={styles.circularContainer}>
        <LinearGradient
          colors={['rgba(32, 129, 226, 0.15)', 'rgba(111, 76, 255, 0.15)']}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.glowContainer}>
            <Svg height={CIRCLE_SIZE} width={CIRCLE_SIZE} style={styles.svg}>
              <Defs>
                <SvgGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#2081E2" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#6F4CFF" stopOpacity="1" />
                </SvgGradient>
                <SvgGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#2081E2" stopOpacity="0.4" />
                  <Stop offset="100%" stopColor="#6F4CFF" stopOpacity="0.4" />
                </SvgGradient>
              </Defs>

              {/* Outer Glow Circle */}
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={(CIRCLE_SIZE - CIRCLE_STROKE + 8) / 2}
                stroke="url(#glowGradient)"
                strokeWidth={CIRCLE_STROKE + 16}
                fill="transparent"
                opacity={0.6}
                style={styles.glowEffect}
              />

              {/* Background Circle */}
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={(CIRCLE_SIZE - CIRCLE_STROKE) / 2}
                stroke="rgba(32, 129, 226, 0.1)"
                strokeWidth={CIRCLE_STROKE}
                fill="transparent"
              />

              {/* Progress Circle */}
              <Circle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={(CIRCLE_SIZE - CIRCLE_STROKE) / 2}
                stroke="url(#progressGradient)"
                strokeWidth={CIRCLE_STROKE}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
              />
            </Svg>

            <View style={styles.circularContent}>
              <Text style={styles.stepsLabel}>Steps Today</Text>
              <Text style={styles.stepsCount}>{healthMetrics.steps.current}</Text>
              <TouchableOpacity style={styles.goalButton}>
                <Text style={styles.goalButtonText}>Set your daily goal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.boostButton}>
                <MaterialCommunityIcons name="lightning-bolt" size={24} color="#2081E2" />
                <Text style={styles.boostText}>Activate 2X Boost</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderMetricCard = (title, icon, current, goal, unit, screen) => (
    <TouchableOpacity 
      style={styles.metricCard}
      onPress={() => navigation.push(screen)}
    >
      <LinearGradient
        colors={['#2C2F48', '#363B64']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardGradient}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Avatar.Icon 
              size={32} 
              icon={icon}
              style={styles.cardIcon}
              color="#9397FF"
            />
            <Text style={styles.cardTitle}>{title}</Text>
          </View>
          
          <View style={styles.metricContent}>
            <Text style={styles.metricText}>
              {current}
              <Text style={styles.unitText}>/{goal}{unit}</Text>
            </Text>
            <LinearGradient
              colors={['rgba(147, 151, 255, 0.2)', 'rgba(147, 151, 255, 0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressContainer}
            >
              <ProgressBar 
                progress={current / goal}
                color="#9397FF"
                style={styles.progressBar}
              />
            </LinearGradient>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderChallengeCard = (challenge) => (
    <TouchableOpacity 
      key={challenge.id}
      style={styles.challengeCard}
      onPress={() => navigation.navigate('ChallengeID', { id: challenge.id })}
    >
      <LinearGradient
        colors={['#2C2F48', '#363B64']}
        style={styles.challengeContent}
      >
        <View style={styles.challengeImageContainer}>
          <Image 
            source={challenge.image}
            style={styles.challengeImage}
            resizeMode="cover"
          />
          <View style={styles.challengeOverlay}>
            <View style={styles.challengeTopMeta}>
              <Chip style={styles.categoryChip}>
                <Text style={styles.chipText}>{challenge.category}</Text>
              </Chip>
              <View style={styles.prizeContainer}>
                <MaterialCommunityIcons name="trophy-outline" size={16} color="#FFD700" />
                <Text style={styles.prizeText}>{challenge.prizeMoney} APT</Text>
              </View>
            </View> 
          </View>
        </View>
        
        <View style={styles.challengeDetails}>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          
          <View style={styles.challengeStats}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="account-group" size={16} color="#9397FF" />
              <Text style={styles.statText}>{challenge.participants}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="clock-outline" size={16} color="#9397FF" />
              <Text style={styles.statText}>{challenge.daysLeft}d left</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="signal" size={16} color="#9397FF" />
              <Text style={styles.statText}>{challenge.difficulty}</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <ProgressBar 
              progress={challenge.progress || 0}
              color="#9397FF"
              style={styles.challengeProgress}
            />
            <Text style={styles.progressText}>{Math.round((challenge.progress || 0) * 100)}% Complete</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#13141C', '#1A1B25', '#2D2E3D']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ScrollView>

        <NavbarComp />

        {renderCircularProgress()}

        <View style={styles.weeklyProgress}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
            <View key={day} style={styles.dayContainer}>
              <View style={[styles.dayDot, index < 5 && styles.completedDay]} />
              <Text style={styles.dayText}>{day}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, {paddingLeft: 16}]}>Today</Text>
        <View style={styles.metricsContainer}>
          {renderMetricCard('Steps', 'walk', healthMetrics.steps.current, healthMetrics.steps.goal, 'k', 'StepsScreen')}
          {renderMetricCard('Calories', 'fire', healthMetrics.calories.burned, healthMetrics.calories.goal, '', 'CaloriesScreen')}
          {renderMetricCard('Goals', 'flag-checkered', healthMetrics.goals.completed, healthMetrics.goals.total, '', 'GoalsScreen')}
          {renderMetricCard('Sleep', 'sleep', healthMetrics.sleep.current, healthMetrics.sleep.goal, 'h', 'SleepScreen')}
        </View>

        <View style={styles.challengesSection}>
          <View style={styles.challengesHeader}>
            <Text style={styles.sectionTitle}>My Challenges</Text>
            <TouchableOpacity>
              <Text style={styles.viewMoreText} onPress={()=>{navigation.navigate('ChallengesGlobal')}}>View more</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.challengesList}>
            {challenges.map(challenge => renderChallengeCard(challenge))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 48,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: 8,
    borderRadius: 20,
    gap: 4,
  },
  streakText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '600',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 8,
    borderRadius: 20,
    gap: 4,
  },
  balanceText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  profileIcon: {
    backgroundColor: 'rgba(147, 151, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(147, 151, 255, 0.3)',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 8,
  },
  metricCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  cardGradient: {
    borderRadius: 16,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  cardIcon: {
    backgroundColor: 'rgba(147, 151, 255, 0.15)',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  metricContent: {
    gap: 12,
  },
  metricText: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  unitText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  progressContainer: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  challengesSection: {
    padding: 16,
  },
  challengesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewMoreText: {
    fontSize: 15,
    color: '#2081E2',
    fontFamily: 'Inter_700Bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  challengeCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2C2F48',
  },
  challengeContent: {
    borderRadius: 12,
  },
  challengeImageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  challengeImage: {
    width: '100%',
    height: '100%',
  },
  challengeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  challengeTopMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryChip: {
    backgroundColor: 'rgba(147, 151, 255, 0.2)',
    height: 26,
  },
  chipText: {
    color: '#9397FF',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  prizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 6,
    borderRadius: 12,
    gap: 4,
  },
  prizeText: {
    color: '#FFD700',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  challengeDetails: {
    padding: 16,
  },
  challengeTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 12,
  },
  challengeStats: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: '#9397FF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  progressSection: {
    gap: 8,
  },
  challengeProgress: {
    height: 4,
    borderRadius: 2,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  circularContainer: {
    alignItems: 'center',
    padding: 20,
  },
  gradientBackground: {
    width: CIRCLE_SIZE + 40,
    height: CIRCLE_SIZE + 40,
    borderRadius: (CIRCLE_SIZE + 40) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: CIRCLE_SIZE / 2,
    overflow: 'hidden',
  },
  svg: {
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
    shadowColor: '#2081E2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  glowEffect: {
    shadowColor: '#2081E2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  circularContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  stepsLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
    marginBottom: 8,
  },
  stepsCount: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 16,
    textShadowColor: 'rgba(32, 129, 226, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  goalButton: {
    backgroundColor: 'rgba(32, 129, 226, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(32, 129, 226, 0.2)',
  },
  goalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  boostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  boostText: {
    color: '#2081E2',
    fontSize: 14,
    fontWeight: '600',
  },
  weeklyProgress: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: 20,
  },
  dayContainer: {
    alignItems: 'center',
    gap: 8,
  },
  dayDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  completedDay: {
    backgroundColor: '#2081E2',
  },
  dayText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
});