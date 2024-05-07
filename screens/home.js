import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';

export default function HomeScreen() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const handleAddTodo = () => {
    if (input.length > 0) {
      setTodos([...todos, { key: Date.now().toString(), text: input }]);
      setInput('');
    }
  };

  const handleRemoveTodo = (key) => {
    setTodos(todos.filter(todo => todo.key !== key));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleRemoveTodo(item.key)}>
      <View style={{ backgroundColor: '#3F4448', margin: 10, padding: 15, borderRadius:10, alignItems: 'center' }}>
        <Text style={{ color: 'white', padding:5 }}>{item.text}</Text>
        <Text style={{ color: 'grey', fontSize:12 }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {"  "} {new Date().toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor:'#373C3F'}}>
      <View style={{marginTop:50}}>
        <TextInput
          style={{ borderColor: 'white', padding:10, color:'white', height: 40, borderColor: 'gray', borderWidth: 1, width: Dimensions.get('window').width - 40, marginBottom: 20, borderRadius:10 }}
          onChangeText={text => setInput(text)}
          value={input}
        />
        <Button onPress={handleAddTodo} style={{ backgroundColor:'white' }} textColor='#3F4448'> Add Todo </Button>
        <FlatList
          data={todos}
          renderItem={renderItem}
          style={{ width: '100%', marginTop: 20 }}
        />
      </View>
    </View>
  );
}