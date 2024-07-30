import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomNavigation } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CustomSplashScreen from './components/splashscreen';

import HomeScreen from './screens/notes';
import SettingsScreen from './screens/settings';
import AddScreen from './screens/notes/add';
import ViewScreen from './screens/notes/view';
import ToDoScreen from './screens/todo';

import SignIn from './screens/auth/signin';
import SignUp from './screens/auth/signup';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

const navRoutes = [
  { key: 'home', title: ' ', icon: 'home-outline', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
  { key: 'todo', title: ' ', icon: 'note', focusedIcon: 'note', unfocusedIcon: 'note-outline' },
  { key: 'settings', title: ' ', icon: 'cog', focusedIcon: 'cog', unfocusedIcon: 'cog-outline' },
];

const Stack = createStackNavigator();

export default function App() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState(navRoutes);
  const [isSplashVisible, setIsSplashVisible] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsSplashVisible(false);
    });

    return () => unsubscribe();
  }, []);

  if (isSplashVisible) {
    return <CustomSplashScreen onFinish={() => setIsSplashVisible(false)} />;
  }

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
      style={{ backgroundColor: focused ? '#FFFFFF' : '#F7F6F3', borderRadius: 10, margin: 5 }}
    />
  );

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {user ? (
            <>
              <Stack.Screen name="HomeScreen" options={{ headerShown: false }}>
                {() => (
                  <BottomNavigation
                    navigationState={{ index, routes }}
                    onIndexChange={setIndex}
                    renderScene={renderScene}
                    activeColor="#2F3438"
                    inactiveColor="#B0B0B0"
                    barStyle={{ backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E0E0E0' }}
                    renderTabBarItem={renderTabBarItem}
                    keyboardHidesNavigationBar="true"
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="AddScreen" component={AddScreen} options={{ headerShown: true, title:"Add Note" }}></Stack.Screen>
              <Stack.Screen name="ViewScreen" component={ViewScreen} options={{ headerShown: false }}></Stack.Screen>
            </>
          ) : (
            <>
              <Stack.Screen name="SignInScreen" component={SignIn} options={{ headerShown: false }}></Stack.Screen>
              <Stack.Screen name="SignUpScreen" component={SignUp} options={{ headerShown: false }}></Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}