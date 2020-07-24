"use strict"
import React, { Component } from 'react';
import {  View, Alert, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import i18next from 'i18next';
import styles from '../stylesheets/MainStyles.style';
import { StackActions, NavigationActions } from 'react-navigation';

class StartWorkingButton extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: i18next.t('start_shift'),
      headerLeft: null
    };
  };

  render() {    
    return (
      <View style={[styles.container, {alignItems: 'center', justifyContent: 'center'}]}>
        <TouchableOpacity style={styles.startWorkButton} onPress={() => StartWork()}>
          <Text style={styles.startShiftBtnText}>{i18next.t('start_working_shift')}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export async function StartWork() {
  fetch(global.DOMAIN + `working-time/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': global.token
    },
  }).then(response => response.json())
    .then((responseJson) => {
      if(responseJson.name === 'JsonWebTokenError'){
        global.navigation.navigate('Login');
      } else {
        global.navigation.navigate('Main');
      }
    })
    .catch(error => console.log(error));
}

//TODO test EndWork
export async function EndWork() {
  Alert.alert(
    i18next.t('exitt'),
    i18next.t('do_you_wanna_finish_shift'),
    [
      {
        text: i18next.t('no'),
        onPress: () => navigation.navigate('Main'),
        style: 'cancel',
      },
      {
        text: i18next.t('end_working_shift') + '?', onPress: () => {
          fetch(global.DOMAIN + `working-time/end`, {
            method: 'PUT',
            headers: {
              'Authorization': global.token
            },
          }).then(() => navigation.navigate('StartWorkingButton')) //TODO: need check if server respons is ok
            .catch(error => console.log(error));
        }
      },
    ],
    { cancelable: false },
  )
}

export default StartWorkingButton;
