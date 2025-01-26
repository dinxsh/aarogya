import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Searchbar, FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { useNavigation } from '@react-navigation/native';

const JournalScreen = () => {
  const [entries, setEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editorVisible, setEditorVisible] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({ id: '', content: '', date: '' });
  const richText = React.useRef();
  const navigation = useNavigation();

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const storedEntries = await AsyncStorage.getItem('journalEntries');
      if (storedEntries !== null) {
        setEntries(JSON.parse(storedEntries));
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const saveEntry = async () => {
    try {
      let updatedEntries;
      if (currentEntry.id) {
        updatedEntries = entries.map(entry =>
          entry.id === currentEntry.id ? { ...currentEntry, content: richText.current.getContentHtml() } : entry
        );
      } else {
        const newEntry = {
          id: Date.now().toString(),
          content: richText.current.getContentHtml(),
          date: new Date().toISOString(),
        };
        updatedEntries = [newEntry, ...entries];
      }
      await AsyncStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
      setEntries(updatedEntries);
      setEditorVisible(false);
      setCurrentEntry({ id: '', content: '', date: '' });
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderEditor = () => (
    <View style={styles.editorContainer}>
      <RichToolbar
        editor={richText}
        actions={['bold', 'italic', 'underline', 'bullet', 'number']}
        iconTint="#000000"
        selectedIconTint="#2196F3"
        style={styles.richToolbar}
      />
      <RichEditor
        ref={richText}
        initialContentHTML={currentEntry.content}
        style={styles.richEditor}
      />
      <TouchableOpacity style={styles.saveButton} onPress={saveEntry}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEntries = () => (
    <ScrollView style={styles.entriesContainer}>
      <Searchbar
        placeholder="Search entries"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      {filteredEntries.map(entry => (
        <Card key={entry.id} style={styles.entryCard}>
          <Card.Content>
            <Title>{new Date(entry.date).toLocaleDateString()}</Title>
            <Paragraph numberOfLines={3}>{entry.content.replace(/<[^>]*>/g, '')}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <TouchableOpacity onPress={() => {
              setCurrentEntry(entry);
              setEditorVisible(true);
            }}>
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {editorVisible ? renderEditor() : renderEntries()}
      {!editorVisible && (
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => {
            setCurrentEntry({ id: '', content: '', date: '' });
            setEditorVisible(true);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  entriesContainer: {
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  entryCard: {
    marginBottom: 16,
  },
  editButton: {
    color: '#2196F3',
  },
  editorContainer: {
    flex: 1,
    padding: 16,
  },
  richToolbar: {
    backgroundColor: '#F5F5F5',
  },
  richEditor: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    marginTop: 16,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
});

export default JournalScreen;
