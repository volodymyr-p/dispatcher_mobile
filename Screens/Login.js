"use strict"
import React, { Component } from 'react';
import { TextInput, View, Text, ActivityIndicator, AsyncStorage, Alert } from 'react-native';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import styles from '../stylesheets/MainStyles.style';
import i18next from 'i18next';
import { RefreshToken } from '../Code/Token';
import { CheckPermissionForNotification } from '../Code/FirebaseBackgroundMessaging';
import { CheckIfUserIsActive } from '../Code/FetchFunctions';
import { showMessage, hideMessage } from "react-native-flash-message";

import FlashMessage from "react-native-flash-message";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      loading: false
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: i18next.t('login'),
    };
  };

  async componentDidMount() {
    await CheckPermissionForNotification();

    this.setState({
      loading: true,
      username: null,
      password: null
    })

    const log = await AsyncStorage.getItem('login');
    const pass = await AsyncStorage.getItem('password');

    this.setState({
      loading: false,
      username: log,
      password: pass
    });
  }

  showTimeoutError() {
    showMessage({
      message: i18next.t('server_error'),
      type: "warning",
      animationDuration: 600
    });
  }

  async onLogin() {
    this.setState({ loading: true });
    let is_success = await RefreshToken(this.state.username,this.state.password);
    this.setState({ loading: false });

    // when request > 6 sec it returns timeout error
    if(is_success === 'timeout'){
      this.showTimeoutError();
    }

    if (is_success) {      
      await AsyncStorage.setItem('login', this.state.username);
      await AsyncStorage.setItem('password', this.state.password);  
      await CheckIfUserIsActive();    
    }
    else {
      this.setState({ password: null });
      Alert.alert(i18next.t('err_log_pas'), i18next.t('err_log_mess'));
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0c9" />
        </View>
      )
    }

    return (
      <View style={styles.loginContainer}>
        <TextInput
          defaultValue={this.state.username}
          onChangeText={(username) => this.setState({username:username})}
          //value={this.state.username}
          placeholder={i18next.t('username')}
          style={styles.loginInput}
        />
        <TextInput
          defaultValue={this.state.password}
          onChangeText={(password) => this.setState({password:password})}
          //value={this.state.password}
          placeholder={i18next.t('password')}
          secureTextEntry={true}
          style={styles.loginInput}
        />

        <AwesomeButtonRick
          style={{ marginLeft: 5, marginTop: 10 }}
          type="primary"
          size="small"
          onPress={this.onLogin.bind(this)}>
          <Text> {i18next.t('login')} </Text>
        </AwesomeButtonRick>
        <FlashMessage position="top" />
      </View>
    );
  }
}
