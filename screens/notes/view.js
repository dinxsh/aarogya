import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Dimensions, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5, Feather, Entypo } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/core';

export default function ViewScreen() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const fetchNotes = async () => {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        let notesWithDates = JSON.parse(storedNotes).map(note => ({ ...note, date: new Date(note.date) }));
        notesWithDates.sort((a, b) => b.date - a.date);
        setNotes(notesWithDates);

        const note = notesWithDates.find(note => note.key === route.params?.id);
        if (note) {
          setTitle(note.title);
          setDescription(note.description);
          setLastUpdated(note.date.toLocaleString());
          navigation.setOptions({ title: note.title });
        }
      }
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    const updateNote = async () => {
      const updatedNotes = notes.map(note => {
        if (note.key === route.params?.id) {
          const updatedNote = { ...note, title, description, date: new Date() };
          setLastUpdated(updatedNote.date.toLocaleString());
          return updatedNote;
        }
        return note;
      });
      setNotes(updatedNotes);
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    };

    if (notes.length > 0) {
      updateNote();
    }
  }, [title, description]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          style={styles.titleInput}
          onChangeText={setTitle}
          value={title}
          placeholder="Title"
          placeholderTextColor='grey'
        />
        <Text style={styles.lastUpdatedText}>Last Updated: {lastUpdated}</Text>
        <TextInput
          style={styles.descriptionInput}
          onChangeText={setDescription}
          value={description}
          placeholder="Description"
          placeholderTextColor='grey'
          numberOfLines={10}
          textAlignVertical='top'
          multiline
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  titleInput: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
  },
  lastUpdatedText: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 20,
  },
  descriptionInput: {
    fontSize: 18,
    color: '#333333',
    flex: 1,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  iconButton: {
    padding: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'white',
    marginLeft: 10,
    backgroundColor: '#3F4448',
  },
});