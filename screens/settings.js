import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { Card, Title, Paragraph, Avatar, Button, IconButton, Switch, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Success', 'You have been logged out.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderSettingItem = (icon, title, value, onPress, type = 'button') => (
    <Card style={styles.settingCard} onPress={onPress}>
      <Card.Content style={styles.settingContent}>
        <Avatar.Icon size={40} icon={icon} style={styles.settingIcon} color="#1E88E5" />
        <View style={styles.settingInfo}>
          <Title style={styles.settingTitle}>{title}</Title>
          {type === 'button' && <Paragraph style={styles.settingValue}>{value}</Paragraph>}
        </View>
        {type === 'switch' && <Switch value={value} onValueChange={onPress} color="#1E88E5" />}
        {type === 'button' && <MaterialCommunityIcons name="chevron-right" size={24} color="#757575" />}
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1E88E5', '#1976D2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Settings</Text>
          <View style={styles.headerRightContent}>
            <TouchableOpacity style={styles.askAIButton} onPress={() => navigation.navigate('ChatScreen')}>
              <Text style={styles.askAIButtonText}>Ask AI</Text>
            </TouchableOpacity>
            <IconButton
              icon="account-circle"
              color="#FFFFFF"
              size={28}
              onPress={() => console.log('Profile pressed')}
            />
          </View>
        </View>
      </LinearGradient>

      {user && (
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Icon size={80} icon="account" style={styles.profileIcon} color="#1E88E5" />
            <View style={styles.profileInfo}>
              <Title style={styles.profileName}>{user.displayName || 'User'}</Title>
              <Paragraph style={styles.profileEmail}>{user.email}</Paragraph>
              <Paragraph style={styles.profileLastLogin}>
                Last login: {new Date(user.metadata.lastSignInTime).toLocaleString()}
              </Paragraph>
            </View>
          </Card.Content>
        </Card>
      )}

      <View style={styles.settingsSection}>
        <Title style={styles.sectionTitle}>Account</Title>
        {renderSettingItem('account-edit', 'Edit Profile', 'Modify your information', () => console.log('Edit Profile'))}
        {renderSettingItem('lock-reset', 'Change Password', 'Update your password', () => console.log('Change Password'))}
      </View>

      <Divider style={styles.divider} />

      <View style={styles.settingsSection}>
        <Title style={styles.sectionTitle}>Preferences</Title>
        {renderSettingItem('bell', 'Notifications', true, () => console.log('Toggle Notifications'), 'switch')}
        {renderSettingItem('theme-light-dark', 'Dark Mode', false, () => console.log('Toggle Dark Mode'), 'switch')}
      </View>

      <Divider style={styles.divider} />

      <View style={styles.settingsSection}>
        <Title style={styles.sectionTitle}>Support</Title>
        {renderSettingItem('help-circle', 'Help Center', 'Get assistance', () => console.log('Help Center'))}
        {renderSettingItem('information', 'About', 'App information', () => console.log('About'))}
      </View>

      <Button
        mode="contained"
        icon="logout"
        onPress={handleLogout}
        style={styles.logoutButton}
        labelStyle={styles.buttonLabel}
      >
        Logout
      </Button>
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
  profileCard: {
    margin: 15,
    borderRadius: 15,
    elevation: 4,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  profileIcon: {
    backgroundColor: '#E3F2FD',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  profileEmail: {
    fontSize: 14,
    color: '#757575',
  },
  profileLastLogin: {
    fontSize: 12,
    color: '#757575',
    marginTop: 5,
  },
  settingsSection: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#424242',
  },
  settingCard: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    backgroundColor: '#E3F2FD',
    marginRight: 15,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  settingValue: {
    fontSize: 14,
    color: '#757575',
  },
  divider: {
    marginVertical: 20,
  },
  logoutButton: {
    margin: 15,
    marginTop: 30,
    backgroundColor: '#FF5252',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});