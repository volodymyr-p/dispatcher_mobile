import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';
import { RefreshToken } from './Token';

const resetActionMain = StackActions.reset({
  index: 0, // <-- currect active route from actions array
  actions: [
    NavigationActions.navigate({ routeName: 'Main' }),
  ],
});

const StartWorkingButton = StackActions.reset({
  index: 0, // <-- currect active route from actions array
  actions: [
    NavigationActions.navigate({ routeName: 'StartWorkingButton' }),
  ],
});

export async function GetCurrentUserInfo() {
  await fetch(global.DOMAIN + `api/perfomer/getCurrentUserInfo`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': global.token
    },
  }).then(response => response.json())
    .then(responseJson => {
      if (responseJson) {
        SetCurrentUserInfo(responseJson[0])
      } else {
        SetCurrentUserInfo(null)
      }
    })
    .catch(error => console.log(error));
}

async function SetCurrentUserInfo(data) {
  await AsyncStorage.setItem('CurrentUserInfo', JSON.stringify(data));
}

export async function CheckIfUserIsActive() {
  let isUserActive = await CheckUser();
  // checking if user is active for the first time
  switch (isUserActive) {
    case true:
      //if it`s true just navigate to main
      this.navigateToMain();
      break;

    case 'bad token':
      // but if function returns 'bad token' we have to refresh token and try again to check user
      const refreshResult = await RefreshToken();
      // if RefreshToken returns true it means that token refreshed successfully and we can try again to check
      // if some error ocures in RefreshToken it will navigate to login page
      if (refreshResult){
        isUserActive = await CheckUser();
        if(isUserActive === true) {
          this.navigateToMain();
        } else {
          this.navigateToStartWorkingButton();
        }
      }
      break;
  
    case false:
      this.navigateToStartWorkingButton();
      break;
  }
}

navigateToMain = () => {
  global.navigation.dispatch(resetActionMain);
}
navigateToStartWorkingButton= () => {
  global.navigation.dispatch(StartWorkingButton);
}

async function CheckUser() {
  const token = await AsyncStorage.getItem('token');
  const response = await fetch(global.DOMAIN + `api/perfomer/isActive`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': global.token
    }
  })
  .catch(err=> {return err})

  if(response.ok){
    const isActive = await response.json();
    if(isActive.length>0 && isActive[0].is_in_process === 1){//already in work
      return true;
    }else{
      return false;
    }
  } else {
    return 'bad token';
  }
}

export async function GetCurrentActiveStatement() {
  fetch(global.DOMAIN + `api/perfomer/getActiveStatementID`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': global.token
    },
  }).then(response => response.json())
    .then(data => {
      if (data.length !== 0) 
        global.CurrentActiveStatement = data[0]
    })
    .catch(error => console.log(error));
}

export async function SaveFCMToken(device_token) {
  fetch(global.DOMAIN + `api/perfomer/putDeviceToken`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': global.token
    },
    body: JSON.stringify({
      device_token: device_token,
    })
  })
    .catch(error => console.log(error));
}

export async function DeleteFCMToken() {
  fetch(global.DOMAIN + `api/perfomer/deleteDeviceToken`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': global.token
    },
  })
    .catch(error => console.log(error));
}
