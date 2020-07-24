import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { NavigationActions } from 'react-navigation';
import { Alert } from 'react-native';

import IOSIcon from "react-native-vector-icons/Ionicons";
import React from 'react';
import {View, TouchableOpacity} from 'react-native';

import SideMenu from "./Components/SideMenu";
import Init from "./Screens/Init";
import Login from "./Screens/Login";
import StartWorkingButton from "./Screens/StartWorkingButton";
import Main from "./Screens/Main";
import StatementInfo from "./Screens/StatementInfo";
import Settings from "./Screens/Settings";
import UploadsManager from "./Screens/UploadsManager";
import MeterReadings from './Screens/MeterReadings';
import { BackHandler } from 'react-native';

const stack = createStackNavigator({
  Init: { screen: Init },
  Login: { screen: Login },
  StartWorkingButton: { screen: StartWorkingButton },
  Main: { 
    screen: Main,
      navigationOptions: ({ navigation }) => ({
      headerLeft: () => <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <View style={{
          paddingLeft: 15
        }}>
          <IOSIcon
            name="ios-menu"
            size={30}
          />
        </View>
      </TouchableOpacity>
    }) },
  StatementInfo: { screen: StatementInfo },
  Settings: { screen: Settings },
  UploadsManager: { screen: UploadsManager },
  MeterReadings: { screen: MeterReadings },
},
  {
    initialRouteName: 'Init',
  }
);

// forbiden to open side menu on certain screen
stack.navigationOptions = ({ navigation }) => {
  name = (navigation.state.index !== undefined ? navigation.state.routes[navigation.state.index] : navigation.state.routeName)
  let drawerLockMode = 'locked-closed'
  if (name.routeName != 'Login') {
    drawerLockMode = 'unlocked'
  }
  return {
    drawerLockMode,
  };
}

const drawer = createDrawerNavigator({  
  Item1: {
    screen: stack,
  }
},
  {
    contentComponent: SideMenu
  }
);
const defaultGetStateForAction = stack.router.getStateForAction;
stack.router.getStateForAction = (action, state) => {
  const screen = state ? state.routes[state.index] : null;
  const tab = screen && screen.routes ? screen.routes[screen.index] : null;
  const tabScreen = tab && tab.routes ? tab.routes[tab.index] : null;

  if (
      action.type === NavigationActions.BACK &&
      (screen.routeName == "Main"|| screen.routeName == "StartWorkingButton")
  ) {       
      Alert.alert(              ////////TODO loc(локализовать)
        //title
        'Вихід',
        //body
        'Ви дійсно хочете вийти?',
        [
          {text: 'Так', onPress: () => {
            BackHandler.exitApp();
          }
        },
          {text: 'Ні', style: 'cancel'},
        ],
        { cancelable: false }
        //clicking out side of alert will not cancel
      );
       return null;
  }

  return defaultGetStateForAction(action, state);
};
export default createAppContainer(drawer);