import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth'; 
import { MaterialIcons } from '@expo/vector-icons'; // Import icons

export default function SettingsScreen() {
  const auth = getAuth();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Success', 'You have been logged out.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      {user && (
        <View style={styles.card}>
          <View style={styles.userInfo}>
            <MaterialIcons name="person" size={24} color="#666666" />
            <View style={styles.userDetails}>
              <Text style={styles.userText}>Logged in as:</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.userText}>Last login:</Text>
              <Text style={styles.userEmail}>{new Date(user.metadata.lastSignInTime).toLocaleString()}</Text>
            </View>
          </View>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: '#FAFAFA',
    margin:15
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 30,
    width: '100%',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 10,
  },
  userText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '500',
  },
});