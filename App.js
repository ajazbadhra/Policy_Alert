import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Home from './src/screens/Home';
import Prediction from './src/screens/Prediction';

const App = ()=>{

  const stack = createStackNavigator()

  return (
    <NavigationContainer>
      <stack.Navigator
        initialRouteName = 'Home'
      >
        <stack.Screen name = 'Home' component = {Home} />
        <stack.Screen name = 'Prediction' component = {Prediction} />
      </stack.Navigator>
    </NavigationContainer>
  )
}

export default App