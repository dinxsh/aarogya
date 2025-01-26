import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function CustomSplashScreen({ onFinish }) {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hideAsync();
      onFinish();
    },1000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Minotes</Text>
      <Text style={styles.text}>minimalistic note taking</Text>
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  }
});