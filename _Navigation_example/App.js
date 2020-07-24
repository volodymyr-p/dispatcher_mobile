import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
 
import FirstPage from './Screens/FirstPage';
import SecondPage from './Screens/SecondPage';

const App = createStackNavigator({
    FirstPage: { screen: FirstPage }, 
    SecondPage: { screen: SecondPage }, 
  },
  {
    initialRouteName: 'FirstPage',
  }
);

export default createAppContainer(App);