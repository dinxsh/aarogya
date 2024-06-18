import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5, Feather, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';

export default function ViewScreen({ route }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigation = useNavigation();

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
        }
    }
    };

    fetchNotes();
    }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor:'#373C3F'}}>
      <View style={{marginTop:50}}>

        <Text style={{ color: 'white', padding:5, fontSize:20, marginBottom:10 }}>
            Update Note
        </Text>

        <TextInput
          style={{ borderColor: 'white', padding:10, color:'white', height: 50, borderColor: 'gray', borderWidth: 1, width: Dimensions.get('window').width - 20, marginBottom: 20, borderRadius:10, fontSize:17 }}
          onChangeText={setTitle}
          value={title}
          placeholder="Title"
          placeholderTextColor='grey'
        />
        <TextInput
          style={{ borderColor: 'white', padding:10, color:'white', flex: 1, borderColor: 'gray', borderWidth: 1, width: Dimensions.get('window').width - 20, marginBottom: 20, borderRadius:10, fontSize:17 }}
          onChangeText={setDescription}
          value={description}
          placeholder="Description"
          placeholderTextColor='grey'
          numberOfLines={3}
          textAlignVertical='top'
          multiline
        />

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <View style={{ padding: 10, borderRadius: 50, borderWidth: 1, borderColor: 'white', marginLeft: 10  }}>
                <FontAwesome5 name="trash" size={24} color="white" />
            </View>
            <View style={{ padding: 10, borderRadius: 50, borderWidth: 1, borderColor: 'white', marginLeft: 10  }}>
                <Feather name="edit" size={24} color="white" />
            </View>
            <View style={{ padding: 10, borderRadius: 50, borderWidth: 1, borderColor: 'white', marginLeft: 10  }}>
                <Entypo name="cross" size={24} color="white" onPress={()=> {navigation.navigate('HomeScreen')} } />
            </View>
        </View>

      </View>
    </View>
  );
}