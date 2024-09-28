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

import StepsScreen from './screens/steps';
import CaloriesScreen from './screens/calories';
import SleepScreen from './screens/sleep';
import GoalsScreen from './screens/goals';

import SignIn from './screens/auth/signin';
import SignUp from './screens/auth/signup';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

const navRoutes = [
  { key: 'home', title: ' ', icon: 'home-outline', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
  { key: 'goals', title: ' ', icon: 'dart-board', focusedIcon: 'dart-board', unfocusedIcon: 'dart-board-outline' },
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
    goals: GoalsScreen,
    settings: SettingsScreen,
  });

  const renderTabBarItem = ({ route, focused }) => (
    <BottomNavigation.Tab 
      key={route.key}
      route={route}
      focused={focused}
      icon={focused ? route.focusedIcon : route.unfocusedIcon}
      style={{
        backgroundColor: focused ? '#1976D2' : '#2196F3',
        borderRadius: 20,
        margin: 5,
        paddingVertical: 8,
      }}
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
                    activeColor="#2196F3"
                    inactiveColor="#E3F2FD"
                    barStyle={{
                      backgroundColor: '#2196F3',
                      borderTopWidth: 0,
                      borderTopLeftRadius: 30,
                      borderTopRightRadius: 30,
                      overflow: 'hidden',
                      height: 60,
                      paddingBottom: 10,
                    }}
                    renderTabBarItem={renderTabBarItem}
                    keyboardHidesNavigationBar={true}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="AddScreen" component={AddScreen} options={{ headerShown: true, title:"Add Note" }}></Stack.Screen>
              <Stack.Screen name="ViewScreen" component={ViewScreen} options={{ headerShown: true }}></Stack.Screen>

              <Stack.Screen name="StepsScreen" component={StepsScreen} options={{ headerShown: false }}></Stack.Screen>
              <Stack.Screen name="CaloriesScreen" component={CaloriesScreen} options={{ headerShown: false }}></Stack.Screen>
              <Stack.Screen name="SleepScreen" component={SleepScreen} options={{ headerShown: false }}></Stack.Screen>
              <Stack.Screen name="GoalsScreen" component={SleepScreen} options={{ headerShown: false }}></Stack.Screen>
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