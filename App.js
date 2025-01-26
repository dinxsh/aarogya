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

import WorkoutsScreen from './screens/workouts';
import StepsScreen from './screens/steps';
import CaloriesScreen from './screens/calories';
import SleepScreen from './screens/sleep';
import GoalsScreen from './screens/goals';
import ChatScreen from './screens/chat';
import JournalScreen from './screens/journal';

import ChallengesGlobal from './screens/challenges/global';
import CreateChallenge from './screens/challenges/create';
import ChallengeID from './screens/challenges/id';

import FriendsScreen from './screens/friends';

import SignIn from './screens/auth/signin';
import SignUp from './screens/auth/signup';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

const navRoutes = [
  { key: 'home', title: ' ', icon: 'home-outline', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
  { key: 'view', title: ' ', icon: 'bullseye', focusedIcon: 'bullseye', unfocusedIcon: 'bullseye-arrow' },
  { key: 'create', title: ' ', icon: 'plus', focusedIcon: 'plus', unfocusedIcon: 'plus-outline' },
  { key: 'friends', title: ' ', icon: 'account-multiple', focusedIcon: 'account-multiple', unfocusedIcon: 'account-multiple-outline' },
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
    view: ChallengesGlobal,
    create: CreateChallenge,
    friends: FriendsScreen,
    settings: SettingsScreen,
  });

  const renderTabBarItem = ({ route, focused }) => (
    <BottomNavigation.Tab 
      key={route.key}
      route={route}
      focused={focused}
      icon={({ size, color }) => {
        const iconName = focused ? route.focusedIcon : route.unfocusedIcon;
        return <MaterialCommunityIcons name={iconName} size={32} color={color} />;
      }}
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
                    activeColor="#9397FF"
                    inactiveColor="rgba(255, 255, 255, 0.6)"
                    barStyle={{
                      backgroundColor: '#2C2F48',
                      borderTopWidth: 0,
                      overflow: 'hidden',
                      height: 70,
                      paddingTop: 0,
                      paddingBottom: 10,
                      elevation: 8,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: -4 },
                      shadowOpacity: 0.25,
                      shadowRadius: 8,
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
              <Stack.Screen name="GoalsScreen" component={GoalsScreen} options={{ headerShown: false }}></Stack.Screen>
              <Stack.Screen name="WorkoutScreen" component={WorkoutsScreen} options={{ headerShown: false }}></Stack.Screen>
              <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }}></Stack.Screen>
              <Stack.Screen name="JournalScreen" component={JournalScreen} options={{ headerShown: false }}></Stack.Screen>


              <Stack.Screen name="ChallengesScreen" component={CreateChallenge} options={{ headerShown: false }}></Stack.Screen>
              <Stack.Screen name="ChallengesGlobal" component={ChallengesGlobal} options={{ headerShown: false }}></Stack.Screen>
              <Stack.Screen name="ChallengeID" component={ChallengeID} options={{ headerShown: false }}></Stack.Screen>

              <Stack.Screen name="FriendsScreen" component={FriendsScreen} options={{ headerShown: false }}></Stack.Screen>
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