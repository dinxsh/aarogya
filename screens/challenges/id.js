import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { Avatar, Title, Button, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

const { width } = Dimensions.get('window');

export default function ChallengeID({ route }) {
  const { id } = route.params;
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold
  });

  const challenge = {
    id: id,
    title: '100 Days Core Challenge',
    description: 'Transform your core strength with daily targeted exercises',
    participants: 1234,
    image: require('../../assets/images/excercises/100-day-core.png'),
    author: {
      name: 'Sarah Wilson',
      avatar: null,
      bio: 'Certified fitness trainer specializing in core strength and functional movement. 10+ years experience helping people achieve their fitness goals.'
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={['#13141C', '#1A1B25', '#2D2E3D']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <ScrollView>
        <ImageBackground
          source={challenge.image}
          style={styles.banner}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(44, 47, 72, 0.75)', 'rgba(54, 59, 100, 0.75)']}
            style={styles.bannerOverlay}
          >
            <Title style={styles.title}>{challenge.title}</Title>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.content}>
          <Text style={styles.description}>{challenge.description}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <MaterialCommunityIcons name="account-group" size={24} color="#9397FF" />
              <Text style={styles.statText}>{challenge.participants} Participants</Text>
            </View>
          </View>

          <View style={styles.authorSection}>
            <View style={styles.authorHeader}>
              <Avatar.Icon 
                size={48} 
                icon="account"
                style={styles.authorAvatar}
                color="#9397FF"
              />
              <View>
                <Text style={styles.authorName}>{challenge.author.name}</Text>
                <Chip style={styles.authorBadge}>
                  <Text style={styles.badgeText}>Challenge Creator</Text>
                </Chip>
              </View>
            </View>
            <Text style={styles.authorBio}>{challenge.author.bio}</Text>
          </View>

          <Button
            mode="contained"
            style={styles.joinButton}
            labelStyle={styles.joinButtonText}
            onPress={() => {
              // Can now use challenge.id when joining
              console.log(`Joining challenge ${challenge.id}`);
            }}
          >
            Join Challenge
          </Button>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    width: width,
    height: 200,
  },
  bannerOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
  },
  content: {
    padding: 20,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(147, 151, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  statText: {
    color: '#9397FF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  authorSection: {
    backgroundColor: 'rgba(44, 47, 72, 0.5)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  authorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  authorAvatar: {
    backgroundColor: 'rgba(147, 151, 255, 0.15)',
  },
  authorName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  authorBadge: {
    backgroundColor: 'rgba(32, 129, 226, 0.15)',
  },
  badgeText: {
    color: '#2081E2',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  authorBio: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  joinButton: {
    backgroundColor: '#2081E2',
    borderRadius: 12,
    padding: 4,
  },
  joinButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
