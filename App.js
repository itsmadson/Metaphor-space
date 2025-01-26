import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import { ThemeProvider } from './components/ThemeContext';
import HomeScreen from './screens/HomeScreen';
import StoryDetails from './components/StoryDetails';
import LikedStories from './components/LikedStories';
import ChatScreen from './screens/ChatScreen'; 

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Vazirmatn': require('./assets/vazirmatn.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="StoryDetails" component={StoryDetails} />
          <Stack.Screen name="LikedStories" component={LikedStories} />
          <Stack.Screen name="Chat" component={ChatScreen} /> 
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}