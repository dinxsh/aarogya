import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, Searchbar, FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export default function AddScreen() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleAddNote = useCallback(async () => {
    if (title.length > 0) {
      const newNotes = [...notes, { key: uuidv4(), title: title, description: description, category: category, date: new Date() }];
      setNotes(newNotes);
      await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
      setTitle('');
      setDescription('');
      setCategory('');
    }
  }, [title, description, notes]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor:'#373C3F'}}>
      <View style={{marginTop:50}}>

        <Text style={{ color: 'white', padding:5, fontSize:20, marginBottom:10 }}>
            Add Note
        </Text>

        <TextInput
          style={{ borderColor: 'white', padding:10, color:'white', height: 50, borderColor: 'gray', borderWidth: 1, width: Dimensions.get('window').width - 20, marginBottom: 20, borderRadius:10 }}
          onChangeText={setTitle}
          value={title}
          placeholder="Title"
          placeholderTextColor='grey'
        />
        <TextInput
          style={{ borderColor: 'white', padding:10, color:'white', flex: 1, borderColor: 'gray', borderWidth: 1, width: Dimensions.get('window').width - 20, marginBottom: 20, borderRadius:10 }}
          onChangeText={setDescription}
          value={description}
          placeholder="Description"
          placeholderTextColor='grey'
          numberOfLines={3}
          textAlignVertical='top'
          multiline
        />
        <TextInput
          style={{ borderColor: 'white', padding:10, color:'white', height: 50, borderColor: 'gray', borderWidth: 1, width: Dimensions.get('window').width - 20, marginBottom: 20, borderRadius:10 }}
          onChangeText={setCategory}
          value={category}
          placeholder="Category"
          placeholderTextColor='grey'
        />
        <Button onPress={handleAddNote} style={{ backgroundColor:'white', width: Dimensions.get('window').width - 20 }} textColor='#3F4448'> Add Note </Button>
      </View>
    </View>
  );
}