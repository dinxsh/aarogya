import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Avatar, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';

export default function NavbarComp() {
    const [visible, setVisible] = useState(false);

    const onToggleSnackBar = () => setVisible(!visible);
    const onDismissSnackBar = () => setVisible(false);

    return (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Avatar.Icon size={40} icon="account" style={styles.profileIcon} />
            <View style={styles.streakContainer}>
              <MaterialCommunityIcons name="fire" size={20} color="#FF6B6B" />
              <Text style={styles.streakText}>5 Streaks</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onToggleSnackBar}>
            <View style={styles.balanceContainer}>
              <MaterialCommunityIcons name="wallet" size={20} color="#4CAF50" />
              <Text style={styles.balanceText}>250 APT</Text>
            </View>
          </TouchableOpacity>

          <Snackbar
            visible={visible}
            onDismiss={onDismissSnackBar}
            duration={3000}
            style={styles.snackbar}
          >
            Connected: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
          </Snackbar>
        </View>
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
      height: 160,
    },
    challengeBackground: {
      width: '100%',
      height: '100%',
    },
    challengeContent: {
      padding: 16,
      height: '100%',
    },
    challengeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    challengeTitle: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Inter_600SemiBold',
    },
    challengeMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    statsText: {
      color: '#9397FF',
      fontSize: 14,
      fontFamily: 'Inter_500Medium',
    },
    challengeProgress: {
      height: 4,
      borderRadius: 2,
    },
    chipText: {
      color: '#9397FF',
      fontSize: 12,
      fontFamily: 'Inter_500Medium',
    },
    circularContainer: {
      alignItems: 'center',
      padding: 20,
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
    snackbar: {
      position: 'absolute',
      bottom: 0,
      backgroundColor: '#2C2F48',
    }
  });
