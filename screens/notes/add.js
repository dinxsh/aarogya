import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Dimensions, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import uuid from 'react-native-uuid';

export default function AddScreen() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const navigation = useNavigation();

  const handleAddNote = useCallback(async () => {
    if (title.length > 0) {
      const newNotes = [...notes, { key: uuid.v4(), title: title, description: description, category: category, date: new Date() }];
      setNotes(newNotes);
      await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
      setTitle('');
      setDescription('');
      setCategory('');
      navigation.navigate('HomeScreen');
    }
  }, [title, description, notes]);

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          onChangeText={setTitle}
          value={title}
          placeholder="Title"
          placeholderTextColor='#B0B0B0'
        />
         <TextInput
          style={styles.input}
          onChangeText={setCategory}
          value={category}
          placeholder="Category"
          placeholderTextColor='#B0B0B0'
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          onChangeText={setDescription}
          value={description}
          placeholder="Description"
          placeholderTextColor='#B0B0B0'
          numberOfLines={3}
          textAlignVertical='top'
          multiline
        />
       
        <Button onPress={handleAddNote} style={styles.button} textColor='#FFFFFF'>Add Note</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#13141C',
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  headerText: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1A1B25',
    padding: 10,
    color: '#FFFFFF',
    height: 50,
    borderColor: '#2D3250',
    borderWidth: 1,
    width: Dimensions.get('window').width - 40,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  textArea: {
    height: Dimensions.get('window').height - 400,
  },
  button: {
    backgroundColor: '#2C2F48',
    width: Dimensions.get('window').width - 40,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});