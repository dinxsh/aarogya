import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { Searchbar, FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import { formatDistanceToNow } from 'date-fns';

const truncate = (input, len) => input.length > len ? `${input.substring(0, len)}...` : input;

const Note = ({ item, handleRemoveNote }) => (
  <TouchableOpacity onPress={() => handleRemoveNote(item.key)}>
    <View style={{ backgroundColor: '#454B4E', margin: 10, padding: 15, borderRadius:10, width: Dimensions.get('window').width - 40 }}>
      <Text style={{ color: 'white', padding:5, fontSize:18 }}>{item.title}</Text>
      <Text style={{ color: 'white', padding:5, fontSize:16 }}>{truncate(item.description, 45)}</Text>
      <Text style={{ color: 'grey', fontSize:14, marginTop:10, textAlign:'right' }}>{formatDistanceToNow(item.date, { addSuffix: true })}</Text>
    </View>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isClicked, setIsClicked] = useState(true);
  const navigation = useNavigation();

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const filteredNotes = notes.filter(note => note.title.includes(searchQuery) || note.description.includes(searchQuery));

  useEffect(() => {
  const intervalId = setInterval(async () => { // assign interval to a variable to clear it.
    const fetchNotes = async () => {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        let notesWithDates = JSON.parse(storedNotes).map(note => ({ ...note, date: new Date(note.date) }));
        notesWithDates.sort((a, b) => b.date - a.date); // sort notes based on date
        setNotes(notesWithDates);
      }
    };

    const fetchDeletedNotes = async () => {
      const storedDeletedNotes = await AsyncStorage.getItem('deletedNotes');
      if (storedDeletedNotes) {
        let deletedNotesWithDates = JSON.parse(storedDeletedNotes).map(note => ({ ...note, date: new Date(note.date) }));
        deletedNotesWithDates.sort((a, b) => b.date - a.date); // sort deleted notes based on date
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor:'#373C3F'}}>
      <View style={{marginTop:50}}>
        
        <Text style={{ color: 'white', padding:5, fontSize:22, width: Dimensions.get('window').width - 20 }}>
            {isClicked ? "Notes" : "Deleted Notes"}
        </Text>

        <View style={{ marginTop:30 }}>
          <Searchbar
            style={{backgroundColor:'darkgray', height:50 }}
            onChangeText={handleSearch}
            value={searchQuery}
          />
        </View>

        <FlatList
          data={isClicked ? filteredNotes : deletedNotes}
          renderItem={(props) => <Note {...props} handleRemoveNote={isClicked ? handleRemoveNote : ()=>{}} />}
          style={{ width: '100%', marginTop: 20 }}
        /> 

        <FAB
          icon={isClicked ? "delete" : "restore"}
          style={{...styles.fab, backgroundColor: 'darkgray'}}
          color={'#373C3F'}
          onPress={handleTaskToggle}
        />

        <FAB
          icon={"plus"}
          style={{backgroundColor: 'darkgray', position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0}}
          color={'#373C3F'}
          onPress={()=> {navigation.navigate('AddScreen')}}
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    left: 0,
    bottom: 0,
  },
})