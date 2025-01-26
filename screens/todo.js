import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const ToDoItem = ({ item, onRemove }) => (
  <TouchableOpacity onPress={() => onRemove(item.key)} accessibilityLabel={`Remove ${item.text}`}>
    <View style={styles.todoItem}>
      <View>
        <Text style={styles.todoText}>{item.text}</Text>
        <Text style={styles.todoTimestamp}>
          {item.reminder ? `Reminder: ${item.reminder.toLocaleString()}` : ''}
        </Text>
      </View>
      <MaterialIcons name="delete" size={24} color="#FF6347" style={styles.deleteIcon} />
    </View>
  </TouchableOpacity>
);

export default function ToDoScreen() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [reminder, setReminder] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleAddTodo = useCallback(() => {
    if (input.length > 0) {
      setShowPicker(true);
    }
  }, [input]);

  const handleRemoveTodo = useCallback((key) => {
    setTodos(todos.filter(todo => todo.key !== key));
  }, [todos]);

  const renderItem = useCallback(({ item }) => (
    <ToDoItem item={item} onRemove={handleRemoveTodo} />
  ), [handleRemoveTodo]);

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || reminder;
      setReminder(currentDate);
      setTodos([{ key: Date.now().toString(), text: input, reminder: currentDate }, ...todos]);
      setInput('');
      setReminder(null);
    }
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setInput}
          value={input}
          placeholder="Add a new task"
          placeholderTextColor='grey'
          accessibilityLabel="Task input"
        />
        <Button onPress={handleAddTodo} style={styles.addButton} textColor='#3F4448' accessibilityLabel="Add task">
          Add Task
        </Button>
        {showPicker && (
          <DateTimePicker
            value={reminder || new Date()}
            mode="datetime"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        style={styles.todoList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#13141C',
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    borderColor: 'gray',
    padding: 10,
    color: '#FFFFFF',
    height: 50,
    borderWidth: 1,
    width: '100%',
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#1A1B25',
  },
  addButton: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  todoList: {
    width: '100%',
  },
  todoItem: {
    backgroundColor: '#2C2F48',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  todoText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  todoTimestamp: {
    color: 'grey',
    fontSize: 12,
  },
  deleteIcon: {
    marginLeft: 10,
  },
});