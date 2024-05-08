import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomNavigation, Text } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/notes';
import SettingsScreen from './screens/settings';
import AddScreen from './screens/notes/add';
import ToDoScreen from './screens/todo';

const navRoutes = [
  { key: 'home', title: ' ', icon: 'home-outline', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
  { key: 'todo', title: ' ', icon: 'note', focusedIcon: 'note', unfocusedIcon: 'note-outline' },
  { key: 'settings', title: ' ', icon: 'cog', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },
];

const Stack = createStackNavigator();

export default function App() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState(navRoutes);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    todo: ToDoScreen,
    settings: SettingsScreen,
  });

  const renderTabBarItem = ({ route, focused }) => (
    <BottomNavigation.Tab 
      key={route.key}
      route={route}
      focused={focused}
      icon={route.icon}
      style={{ backgroundColor: focused ? '#F7F6F3' : '#F7F6F3' }}
    />
  );

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="HomeScreen" options={{ headerShown: false }}>
            {() => (
              <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
                activeColor="#2F3438"
                inactiveColor="#F7F6F3"
                barStyle={{ backgroundColor: '#2F3438' }}
                renderTabBarItem={renderTabBarItem}
                keyboardHidesNavigationBar="true"
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="AddScreen" component={AddScreen} options={{ headerShown: false }}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}