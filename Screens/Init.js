"use strict"
import React, { Component } from 'react';
import { View, ActivityIndicator, Text, PermissionsAndroid, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { RefreshToken } from '../Code/Token';
import { CheckIfUserIsActive } from '../Code/FetchFunctions';
import styles from '../stylesheets/MainStyles.style';
import { i18init } from '../Code/i18_init';
import { CheckPermissionForNotification } from '../Code/FirebaseBackgroundMessaging';
import { RequestCameraPermission, RequestReadExternalStorage } from "../Code/RequestPermission";
import { CheckInternetConnection } from "../Code/Utils";
import i18next from 'i18next';
import BackgroundJob from 'react-native-background-job';
import { UploadMetersPhoto } from "../Code/Utils";

class Init extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isActive: '',
      connectionStatus: true
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Загрузка...',
    };
  };

  async componentDidMount() {
    await RequestCameraPermission();
    await RequestReadExternalStorage();

    global.DOMAIN = '';
    //global.DOMAIN = '';
    global.navigation = this.props.navigation;

    //used for initialized i18_next for all components
    await i18init();

    //check if token exist, if not => navigating to Login page
    const token = await AsyncStorage.getItem('token');
    if(token == '' || token == null){
      this.props.navigation.navigate('Login');
      return;
    } else {
      global.token = token;
    }

    // set default parameter for uploading files ( if true => upload using only wifi)
    const currentWiFiParameter = await AsyncStorage.getItem('loadJustOnWIFI');
    const parsedCurrentWiFiParameter = JSON.parse(currentWiFiParameter);
    if(!!parsedCurrentWiFiParameter) {
      await AsyncStorage.setItem('loadJustOnWIFI', JSON.stringify('true'));
    }
    
    CheckPermissionForNotification();
    await this.checkConnection();

    this.setState({
      loading: false
    })

    // register and schedule BackgroundJob for background uploading photos for meters
    const backgroundJob = {
    jobKey: "uploadMeterPhotos",
      job: () => UploadMetersPhoto()
    };
    
    BackgroundJob.register(backgroundJob);
    
    var backgroundSchedule = {
      jobKey: "uploadMeterPhotos",
    }
    
    BackgroundJob.schedule(backgroundSchedule)
      .then(() => UploadMetersPhoto())
      .catch(err => console.log(err));
  }

  checkConnection = async () => {
    const connectionStatus = await CheckInternetConnection();

    this.setState({
      connectionStatus,
    })

    if(connectionStatus){
      await CheckIfUserIsActive();
    }
  }

  render() {
    if (!this.state.connectionStatus) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8f8f8f'}}>
              <Image 
                source={require('../assets/no-network.png')} 
                style={{  width: 80, height: 80 }}
              />
              <Text style={{textAlign: 'center'}}>{i18next.t('no_internet_connection')}</Text>
              <TouchableOpacity 
                activeOpacity = { .5 } 
                onPress={() => {this.checkConnection();}}
                style={{
                  borderWidth: 2, 
                  borderColor:'#000000', 
                  padding: '1%', 
                  borderRadius: 20,
                  marginTop: '10%'
                }}>
                <Text>{i18next.t('retry')}</Text>
              </TouchableOpacity>
        </View>
      )
    }

    if (this.state.loading) {
      return (
      <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0c9" />
      </View>
      )
    }

    return (
      <View ></View>
    )
  } 
}

export default Init;