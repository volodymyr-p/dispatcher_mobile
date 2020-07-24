import type, { RemoteMessage } from 'react-native-firebase';
import firebase from 'react-native-firebase';
import {Linking, ToastAndroid} from 'react-native';
import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { SaveFCMToken } from './FetchFunctions'

/// When Application is in Background to recieve a notification.
export default async (message: RemoteMessage) => {
    // handle your message
    //ToastAndroid.show("Data: "+JSON.stringify(message), ToastAndroid.LONG);
    return Promise.resolve();
}

export async function CheckPermissionForNotification() {
  const enabled = await firebase.messaging().hasPermission();
  if (enabled) {
      this.getToken();
  } else {
      this.requestPermission();
  }
}
// TODO rewrite next fcm token saving
 getToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  SaveFCMToken(fcmToken);

  if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      SaveFCMToken(fcmToken);
      if (fcmToken) {
          // user has a device token
          await AsyncStorage.setItem('fcmToken', fcmToken);
      }
  }
}

requestPermission = async () => {
  try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
  } catch (error) {
      // User has rejected permissions
      console.log(error);
  }
}
