import * as React from 'react';
import { Text, View } from 'react-native';

export default function SettingsScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor:'#373C3F'}}>
        <Text style={{color:'white'}}>Settings</Text>
      </View>
    );
  }