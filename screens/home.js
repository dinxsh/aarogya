import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, Searchbar, FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Note = ({ item, handleRemoveNote }) => (
  <TouchableOpacity onPress={() => handleRemoveNote(item.key)}>
    <View style={{ backgroundColor: '#454B4E', margin: 10, padding: 15, borderRadius:10, width: Dimensions.get('window').width - 40 }}>
      <Text style={{ color: 'white', padding:5, fontSize:18 }}>{item.title}</Text>
      <Text style={{ color: 'white', padding:5, fontSize:16 }}>{item.description}</Text>
      <Text style={{ color: 'grey', padding:5, fontSize:14, textAlign:'right' }}>category: {item.category}</Text>
      <Text style={{ color: 'grey', fontSize:14, marginTop:10, textAlign:'right' }}>  {item.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {"  "} {item.date.toLocaleDateString()}</Text>
    </View>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isClicked, setIsClicked] = useState(false);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const filteredNotes = notes.filter(note => note.title.includes(searchQuery) || note.description.includes(searchQuery));

  useEffect(() => {
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
  }, []);

  const handleAddNote = useCallback(async () => {
    if (title.length > 0) {
      const newNotes = [...notes, { key: Date.now().toString(), title: title, description: description, category: category, date: new Date() }];
      setNotes(newNotes);
      await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
      setTitle('');
      setDescription('');
      setCategory('');
    }
  }, [title, description, notes]);

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
        <TextInput
          style={{ borderColor: 'white', padding:10, color:'white', height: 50, borderColor: 'gray', borderWidth: 1, width: Dimensions.get('window').width - 20, marginBottom: 20, borderRadius:10 }}
          onChangeText={setTitle}
          value={title}
          placeholder="Title"
          placeholderTextColor='grey'
        />
        <TextInput
          style={{ borderColor: 'white', padding:10, color:'white', height: 50, borderColor: 'gray', borderWidth: 1, width: Dimensions.get('window').width - 20, marginBottom: 20, borderRadius:10 }}
          onChangeText={setDescription}
          value={description}
          placeholder="Description"
          placeholderTextColor='grey'
          numberOfLines={3}
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

        <View style={{ marginTop:40 }}>
          <Searchbar
            style={{backgroundColor:'darkgray', height:50 }}
            onChangeText={handleSearch}
            value={searchQuery}
          />
        </View>

        <Text style={{ color: 'white', padding:5, fontSize:16, marginTop:10, marginBottom:0, marginRight:60 }}>
        {isClicked ? "Notes" : "Deleted Notes"}
        </Text>

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

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})