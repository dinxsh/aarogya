import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, RefreshControl, FlatList, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { Searchbar, FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import { formatDistanceToNow } from 'date-fns';

const truncate = (input, len) => input.length > len ? `${input.substring(0, len)}...` : input;

const Note = ({ item }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('ViewScreen', { id: item.key })}>
      <View style={styles.noteContainer}>
        <Text style={styles.noteTitle}>{item.title}</Text>
        <Text style={styles.noteDescription}>{truncate(item.description, 45)}</Text>
        <Text style={styles.noteDate}>{formatDistanceToNow(item.date, { addSuffix: true })}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClicked, setIsClicked] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    const fetchNotes = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem('notes');
        if (storedNotes) {
          let notesWithDates = JSON.parse(storedNotes).map(note => ({ ...note, date: new Date(note.date) }));
          notesWithDates.sort((a, b) => b.date - a.date);
          setNotes(notesWithDates);
        }
      } catch (error) {
        // Handle error
      } finally {
        setRefreshing(false);
      }
    };
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(note => note.title.includes(searchQuery) || note.description.includes(searchQuery));

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const fetchNotes = async () => {
        const storedNotes = await AsyncStorage.getItem('notes');
        if (storedNotes) {
          let notesWithDates = JSON.parse(storedNotes).map(note => ({ ...note, date: new Date(note.date) }));
          notesWithDates.sort((a, b) => b.date - a.date);
          setNotes(notesWithDates);
        }
      };

      const fetchDeletedNotes = async () => {
        const storedDeletedNotes = await AsyncStorage.getItem('deletedNotes');
        if (storedDeletedNotes) {
          let deletedNotesWithDates = JSON.parse(storedDeletedNotes).map(note => ({ ...note, date: new Date(note.date) }));
          deletedNotesWithDates.sort((a, b) => b.date - a.date);
          setDeletedNotes(deletedNotesWithDates);
        }
      };

      fetchNotes();
      fetchDeletedNotes();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleRemoveNote = useCallback(async (key) => {
    const newDeletedNotes = [...deletedNotes, notes.find(note => note.key === key)];
    const newNotes = notes.filter(note => note.key !== key);
    setDeletedNotes(newDeletedNotes);
    setNotes(newNotes);
    await AsyncStorage.setItem('deletedNotes', JSON.stringify(newDeletedNotes));
    await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
  }, [notes, deletedNotes]);

  const handleTaskToggle = useCallback(() => {
    setIsClicked(prevIsClicked => !prevIsClicked);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{isClicked ? "Notes" : "Deleted Notes"}</Text>
        <Searchbar
          style={styles.searchbar}
          onChangeText={handleSearch}
          value={searchQuery}
        />
      </View>

      <FlatList
        data={isClicked ? filteredNotes : deletedNotes}
        renderItem={(props) => <Note {...props} handleRemoveNote={isClicked ? handleRemoveNote : () => { }} />}
        style={styles.flatList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />

      <FAB
        icon={isClicked ? "delete" : "restore"}
        style={styles.fabLeft}
        color={'#373C3F'}
        onPress={handleTaskToggle}
      />

      <FAB
        icon={"plus"}
        style={styles.fabRight}
        color={'#373C3F'}
        onPress={() => { navigation.navigate('AddScreen') }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginTop: 30,
    width: '100%',
  },
  headerText: {
    color: '#333',
    padding: 5,
    fontSize: 22,
    fontWeight: 'bold',
  },
  searchbar: {
    backgroundColor: '#e0e0e0',
    height: 50,
    borderRadius: 10,
    marginTop: 10,
  },
  flatList: {
    width: '100%',
    marginTop: 20,
  },
  noteContainer: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  noteTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noteDescription: {
    color: '#666',
    fontSize: 16,
    marginTop: 5,
  },
  noteDate: {
    color: '#999',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'right',
  },
  fabLeft: {
    position: 'absolute',
    margin: 16,
    left: 0,
    bottom: 0,
    backgroundColor: '#e0e0e0',
  },
  fabRight: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#e0e0e0',
  },
});