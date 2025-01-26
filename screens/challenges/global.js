import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { Title, Chip, ProgressBar, Menu, Provider as PaperProvider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function ChallengesGlobal() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);
  const [difficultyMenuVisible, setDifficultyMenuVisible] = useState(false);
  const [modeMenuVisible, setModeMenuVisible] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = ['All', 'Cardio', 'Strength', 'HIIT', 'Yoga'];
  const types = ['All', 'Workout', 'Walking', 'Diet'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  // Template challenges
  const templateChallenges = [
    {
      id: '1',
      title: '15 Day Workout',
      image: require('../../assets/images/excercises/15-day-workout.png'),
      progress: 0,
      daysLeft: 30,
      category: 'Strength',
      difficulty: 'Medium',
      participants: 245,
      prizeMoney: 1000,
      status: 'active',
      createdAt: new Date()
    },
    {
      id: '2', 
      title: '7 Day Yoga',
      image: require('../../assets/images/excercises/7-day-yoga.png'),
      progress: 0,
      daysLeft: 28,
      category: 'Wellness',
      difficulty: 'Easy',
      participants: 189,
      prizeMoney: 750,
      status: 'active',
      createdAt: new Date()
    },
  ];

  useEffect(() => {
    const db = getFirestore();
    const auth = getAuth();
    
    const challengesRef = collection(db, 'challenges');
    const q = query(
      challengesRef,
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const challengesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        daysLeft: Math.ceil((doc.data().deadline.toDate() - new Date()) / (1000 * 60 * 60 * 24))
      }));
      // Combine template challenges with Firebase challenges
      setChallenges([...templateChallenges, ...challengesList]);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching challenges:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || challenge.category === selectedFilter;
    const matchesType = selectedType === 'All' || challenge.difficulty === selectedType;
    return matchesSearch && matchesFilter && matchesType;
  });

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
                <Text style={styles.prizeText}>${challenge.prizeMoney}</Text>
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
    <PaperProvider>
      <LinearGradient
        colors={['#13141C', '#1A1B25', '#2D2E3D']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={24} color="#9397FF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search challenges..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          <Menu
            visible={typeMenuVisible}
            onDismiss={() => setTypeMenuVisible(false)}
            anchor={
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setTypeMenuVisible(true)}
              >
                <Text style={styles.dropdownText}>Type: {selectedType}</Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#9397FF" />
              </TouchableOpacity>
            }
          >
            {types.map(type => (
              <Menu.Item
                key={type}
                onPress={() => {
                  setSelectedType(type);
                  setTypeMenuVisible(false);
                }}
                title={type}
                titleStyle={{color: selectedType === type ? '#9397FF' : '#000000'}}
              />
            ))}
          </Menu>

          <Menu
            visible={difficultyMenuVisible}
            onDismiss={() => setDifficultyMenuVisible(false)}
            anchor={
              <TouchableOpacity
                style={[styles.dropdown, {marginHorizontal: 8}]}
                onPress={() => setDifficultyMenuVisible(true)}
              >
                <Text style={styles.dropdownText}>Difficulty: {selectedDifficulty}</Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#9397FF" />
              </TouchableOpacity>
            }
          >
            {difficulties.map(difficulty => (
              <Menu.Item
                key={difficulty}
                onPress={() => {
                  setSelectedDifficulty(difficulty);
                  setDifficultyMenuVisible(false);
                }}
                title={difficulty}
                titleStyle={{color: selectedDifficulty === difficulty ? '#9397FF' : '#000000'}}
              />
            ))}
          </Menu>

          <Menu
            visible={modeMenuVisible}
            onDismiss={() => setModeMenuVisible(false)}
            anchor={
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setModeMenuVisible(true)}
              >
                <Text style={styles.dropdownText}>Mode: {selectedMode}</Text>
                <MaterialCommunityIcons name="chevron-down" size={20} color="#9397FF" />
              </TouchableOpacity>
            }
          >
            {filters.map(mode => (
              <Menu.Item
                key={mode}
                onPress={() => {
                  setSelectedMode(mode);
                  setModeMenuVisible(false);
                }}
                title={mode}
                titleStyle={{color: selectedMode === mode ? '#9397FF' : '#000000'}}
              />
            ))}
          </Menu>
        </ScrollView>

        <ScrollView style={styles.challengesList}>
          {filteredChallenges.map(challenge => renderChallengeCard(challenge))}
        </ScrollView>
      </LinearGradient>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(147, 151, 255, 0.1)',
    margin: 16,
    padding: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#FFFFFF',
    fontSize: 16,
  },
  filterRow: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(147, 151, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  dropdownText: {
    color: '#9397FF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  challengesList: {
    padding: 16,
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
  },
  challengeDetails: {
    padding: 16,
  },
  challengeTitle: {
    color: '#FFFFFF',
    fontSize: 18,
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
  },
});
