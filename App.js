import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomNavigation, Text } from 'react-native-paper';
import HomeScreen from './screens/home';
import SettingsScreen from './screens/settings';

const navRoutes = [
  { key: 'home', title: ' ', icon: 'home-outline', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
  { key: 'settings', title: ' ', icon: 'cog', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },
];

export default function App() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState(navRoutes);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
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
    </SafeAreaProvider>
  );
}