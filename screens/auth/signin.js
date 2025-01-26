import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, signInWithEmailAndPassword } from '../../firebase';

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleSignin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'User signed in successfully!');
      navigation.navigate('HomeScreen');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/auth_wallpaper.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign In</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Username/Email</Text>
            <TextInput
              style={styles.input}
              placeholder="username or email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              accessibilityLabel="Email"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              accessibilityLabel="Password"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSignin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
          </TouchableOpacity>
          <View style={styles.actionLinksDiv}>
            <Text onPress={() => { navigation.navigate('SignUpScreen') }} style={styles.actionLinks}>Sign up for an account</Text>
            <Text style={styles.actionLinks}>Forgot password? recover</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#13141C',
  },
  actionLinks: {
    marginVertical: 3,
    color: 'darkblue',
  },
  actionLinksDiv: {
    marginVertical: 5,
    color: 'darkblue',
  },
  formContainer: {
    backgroundColor: '#1A1B25',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '90%',
    maxWidth: 400,
    borderColor: '#2D2E3D',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    color: '#9397FF',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#363B64',
    borderRadius: 5,
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: '#2C2F48',
  },
  button: {
    backgroundColor: '#2D3250',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});