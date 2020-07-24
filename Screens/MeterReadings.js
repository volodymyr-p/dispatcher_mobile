"use strict"
import React, { Component } from 'react';
import { TextInput, View, Text, ActivityIndicator, Image, KeyboardAvoidingView, ScrollView, AsyncStorage, TouchableOpacity } from 'react-native';
import i18next from 'i18next';
import styles from '../stylesheets/MainStyles.style';
import metersStyles from '../stylesheets/MeterReadingsStyles';
import Icon from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import CheckBox from 'react-native-check-box'
import { UploadsManager } from '../Screens/UploadsManager';
import axios from 'axios';
import * as Progress from 'react-native-progress';

import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import ImagePicker from 'react-native-image-picker';
import NetInfo from "@react-native-community/netinfo";

export default class MeterReadings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPrivateHouse: false,
      city: null,
      street: null,
      house: null,
      counter_number: null,
      flat: null, 
      cityFieldValid: true,
      streetFieldValid: true,
      houseFieldValid: true,
      flatFieldValid: true,
      controlVarForValidation: false,
      metersData: [],
      dataForUpload: null,
      borderButtonState: 'gray'
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: i18next.t('add_meters'),
    };
  };

  async componentDidMount() {
    let metersData = JSON.parse(await AsyncStorage.getItem('imageMetersURIs'));
    const loadUsingOnlyWIFI = JSON.parse(await AsyncStorage.getItem('loadJustOnWIFI'));
    global.loadUsingOnlyWIFI = loadUsingOnlyWIFI;

    // need when AsyncStorage return undefined (when AsyncStorage doesn`t have uri)
    if(!metersData || metersData === null) {
      metersData = []
    }

    // used to retry upload pictures which haven`t been uploaded yet 
    if(!!metersData){
      metersData.map(image => {
        if(!image.uploadStatus || image.delayedUploadStatus){
          this.uploadFiles(image, true);
        }
      })
    }   
    this.setState({ 
      metersData, 
      loadUsingOnlyWIFI
    });
  }

  changeByOne(whatToChange, value) {
    if(whatToChange === 'house'){
      this.setState(prevState => ({
        house: prevState.house + value > -1 ? prevState.house + value : 0
      }))
    }
    if(whatToChange === 'flat'){
      this.setState(prevState => ({
        flat: prevState.flat + value > -1 ? prevState.flat + value : 0
      }), function () {
        this.validateForm();
      })
    }
  }

  validateForm() {
    this.validateCityField();
    this.validateStreetField();
    this.validateHouseField();
    this.validateFlatField();
  }

  setMetersData(data) {
    this.setState({metersData: data})
  }

  setPhotoSource(data) {
    this.setState({photoSource: data})
  }
  
  validateCityField() {
    const { city } = this.state;
    this.setState({cityFieldValid: (city === null || city === '' ||  1 > city.length > 50) ? false : true, controlVarForValidation: true});
  }

  validateStreetField() {
    const { street } = this.state;
    this.setState({streetFieldValid: (street === null || street === '' || 1 > street.length > 50) ? false : true, controlVarForValidation: true});
  }

  validateHouseField() {
    const { house } = this.state;
    this.setState({houseFieldValid: (house === null || house === '' || 1 > house.length > 50) ? false : true, controlVarForValidation: true});
  }

  validateFlatField() {
    const { flatFieldValid, isPrivateHouse, flat } = this.state;
    this.setState({flatFieldValid: isPrivateHouse ? true : (flat === null || flat === '' || flat < 1) ? false : true, controlVarForValidation: true});
  }

  choosePhoto(userAddressData) {
    const options = {
      title: i18next.t('choose_image'),
      takePhotoButtonTitle : i18next.t('take_photo'),
      chooseFromLibraryButtonTitle : i18next.t('choose_from_gallery'),
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => { 
      if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({borderButtonState: 'red'});
      } else if (response.uri) {       
        this.prepareDataObjectForUpload(userAddressData, response)
      }
    });
  }

  prepareDataObjectForUpload (userAddressData, response) {
    const source = { 
      uri: response.uri, 
      type: response.type, 
      name : response.fileName, 
      city: userAddressData.city,
      street: userAddressData.street,
      house_number: userAddressData.house,
      counter_number: userAddressData.counter_number,
    };
    userAddressData.flat ? source['flat_number'] = userAddressData.flat : null;

    this.setState({
      borderButtonState: 'green',
      dataForUpload: source
      }); 
  }

  uploadFiles = async (source, isReload, forceLoad) => {
    if(source === null){
      this.setState({borderButtonState: 'red'});
      return;
    }
    const loadUsingOnlyWIFI = global.loadUsingOnlyWIFI;
    const token = await AsyncStorage.getItem('token');
    let data = new FormData();
    let metersPhotoData = JSON.parse(await AsyncStorage.getItem('imageMetersURIs'));

    if(!metersPhotoData || metersPhotoData === null){
      metersPhotoData = []
    }
    
    for (var prop in source) {
      data.append(prop, source[prop]);
    }

    data.append(`file_`, {
      uri: source.uri,
      type: source.type,
      name: source.name
    });

    // making new object of image with adding uploadStatus and delayedUploadStatus props
    const newImageData = {
      uri: source.uri, 
      type: source.type, 
      userAddressData: source.userAddressData, 
      name: source.name,
      city: source.city,
      street: source.street,
      house_number: source.house_number,
      flat_number: source.flat_number,
      counter_number: source.counter_number,
      uploadStatus: false,
      delayedUploadStatus: loadUsingOnlyWIFI
    }

    // used to prevent repeating images while reloading them
    if(!isReload){
      this.setState(prevState => ({
        metersData: [...prevState.metersData, newImageData]
      }), async () => {
        await this.saveImageDataToAS(this.state.metersData);
      })
    }

    // user can force-push photo from menu (independent from settings and connection)
    if(forceLoad){
      this.axiosRequest(token, data, source);
      return;
    }

    NetInfo.fetch().then(state => {
      if(state.type === 'wifi') {
        // Device is connected to wifi and uploading only using wifi
        this.axiosRequest(token, data, source);
      } else {
        if (!loadUsingOnlyWIFI) {
          // Device is not connected to wifi but settings allow to upload
          this.axiosRequest(token, data, source);
        } else {
          // Device not connected to wifi and setting banned upload without wifi
          this.changeImageStatus('uploadStatus', false, source);
          this.changeImageStatus('delayedUploadStatus', true, source);
        }
      }
    });
    this.setState({
      borderButtonState: 'gray', 
      dataForUpload: null
      });
    showMessage({ message: "Додано в чергу на завантаження", type: "success" });
  }

  saveImageDataToAS = async (data) => {
    await AsyncStorage.setItem('imageMetersURIs', JSON.stringify(data));
  }

  axiosRequest = (token, data, source) => {
    axios.request({
      method: "post",
      url: `${global.DOMAIN}counters/upload`,
      headers: {
        Accept: "application/x-www-form-urlencoded",
        Authorization: token,
      },
      data: data,
      onUploadProgress: (progressEvent) => {
        const uploadSt = (Math.round((progressEvent.loaded * 100) / progressEvent.total));
        console.log(uploadSt)
        if(uploadSt === 100){
          this.changeImageStatus('uploadStatus', true, source);
          this.changeImageStatus('delayedUploadStatus', false, source);
        }
      }
    }).catch(err => {
      // if cathc error it means that picture didn`t upload ( not sure=) ) 
      this.changeImageStatus('uploadStatus', false, source);
      alert("Error ocures when uploading image: " + err);
    });
  }

  changeImageStatus = (statusType, status, source) => {
    this.setState((prevState) => {
      return {
        metersData: prevState.metersData.map((meterData) => {
          if (meterData.uri === source.uri) {
            if(statusType === 'uploadStatus'){
              return { ...meterData, uploadStatus: status };
            }

            if(statusType === 'delayedUploadStatus'){
              return { ...meterData, delayedUploadStatus: status };
            }
          } else {
            return meterData;
          }
        }),
      };
    }, async () => {
        await this.saveImageDataToAS(this.state.metersData);
      })
  }

  updateImagesState = (imageName) => {
    this.setState({
      metersData: this.state.metersData.filter((imageData) => { 
          return imageData.name !== imageName
        })
    },function () {
        this.saveImageDataToAS(this.state.metersData);
    });
  }

  render() {
    const {city, street, house, isPrivateHouse, 
          counter_number, flat, flatFieldValid, controlVarForValidation, 
          cityFieldValid, streetFieldValid, houseFieldValid, dataForUpload, borderButtonState, metersData } = this.state;
    const userAddressData = { city, street, house, flat, counter_number, isPrivateHouse};
    let disabledButton = true;
    
    if(cityFieldValid && streetFieldValid && houseFieldValid && (flatFieldValid || isPrivateHouse) && controlVarForValidation){
      disabledButton = false
    } else {
      disabledButton = true
    }

    return (
      <ScrollView style={metersStyles.container}>
        <KeyboardAvoidingView >

          {/* --start-- input and labels for city */}
          <View>
            <Text style={metersStyles.label}>{i18next.t('city')}</Text>
            <TextInput 
              defaultValue={city}
              maxLength={50}
              onChangeText={(city) => this.setState({city})}
              onBlur={()=> this.validateCityField()}
              style={cityFieldValid ? metersStyles.input : metersStyles.inputInvalid}
            />
          </View>
          {/* --end-- input and labels for city */}

          {/* --start-- input and labes for street */}
          <View >
            <Text style={metersStyles.label}>{i18next.t('street')}</Text>
            <TextInput 
              defaultValue={street}
              maxLength={50}
              onChangeText={(street) => this.setState({street})}
              onBlur={()=> this.validateStreetField()}
              style={streetFieldValid ? metersStyles.input : metersStyles.inputInvalid}
            />
          </View>
          {/* --end-- input and labes for street */}

          {/* --start-- inputs and labels for house and flat */}
          <View style={{flexDirection: 'row', marginLeft: '2.5%', marginRight: '2.5%'}}>
            {/* --start-- rendering input for house */}
            <View style={isPrivateHouse ? { flex: 1 } : { flex: 0.5 }}>
              <Text style={metersStyles.label}>{i18next.t('house')}</Text>
                  <TextInput 
                    defaultValue={house}
                    maxLength={50}
                    onChangeText={(house) => this.setState({ house: house })}
                    onBlur={()=> this.validateHouseField()}
                    style={[houseFieldValid ? metersStyles.input : metersStyles.inputInvalid, {flex: 0.9}]}
                  />
            </View>  
            {/* --end-- rendering input for house */}

            {/* --start-- rendering input for flat */}
            { !isPrivateHouse ? 
            <View style={{flex: 0.5}}>
              <Text style={metersStyles.label}>{i18next.t('flat')}</Text>
              <View style={ {flexDirection: 'row'} }>
                <TextInput 
                  defaultValue={flat > 0 && flat !== null ? flat.toString() : null}
                  onChangeText={(flat) => this.setState( {flat: parseInt(flat) })}
                  onBlur={()=> this.validateFlatField()}
                  style={[flatFieldValid ? metersStyles.input : metersStyles.inputInvalid, {flex: 0.9}]}
                  keyboardType={'numeric'}
                />
                <View>
                  <Icon.Button
                    name="up"
                    backgroundColor="#656565"
                    size={10}
                    onPress={() => this.changeByOne('flat', 1)}>
                  </Icon.Button>
                  <Icon.Button
                    backgroundColor="#656565"
                    name="down"
                    size={10}
                    onPress={() => this.changeByOne('flat', -1)}>
                  </Icon.Button>
                </View>
              </View>
            </View>
            : null}
            {/* --end-- rendering input for flat */}
          </View>
          {/* --end-- inputs and labels for house and flat */}

          {/* --start-- checkbox */}
          <View style={metersStyles.checkboxContainer}>
            <CheckBox
              isChecked={isPrivateHouse}
              onClick={() => this.setState({ isPrivateHouse: !isPrivateHouse, flat: null })}
              unCheckedImage={<Fontisto name="checkbox-passive" size={20} />}
              checkedImage={<Fontisto name="checkbox-active" size={20} />}
            />
            <Text style={metersStyles.checkboxText}>{i18next.t('it_is_private_house')}</Text>
          </View>
          {/* --end-- checkbox */}

          {/* --start-- input for counter value and add photo button*/}
          <View style={{flex: 1, flexDirection: 'row', marginLeft: '2.5%', marginRight: '2.5%'}}>
            <View style={{flex: 0.9}}>
                <Text style={metersStyles.label}>{i18next.t('counter_number')}</Text>
                <TextInput 
                  defaultValue={counter_number > 0 ? counter_number.toString() : null}
                  onChangeText={(counter_number) => this.setState( {counter_number: parseInt(counter_number) })}
                  style={[metersStyles.input, {flex: 1}]}
                  keyboardType={'numeric'}
                />
            </View>
            <TouchableOpacity 
              activeOpacity = { .5 } 
              onPress={() => disabledButton ? this.validateForm() : this.choosePhoto(userAddressData)}
              style={{
                borderWidth: 2, 
                borderColor: `${borderButtonState}`|| 'gray', 
                padding: '1%', 
                borderRadius: 20
              }}
              >
              <Image 
                source={require('../assets/add_photo.png')} 
                style={{  width: 80, height: 80 }}
                />
            </TouchableOpacity>
          </View>
          {/* --end-- input for counter value and add photo button*/}
          <View style={{alignItems: 'center', justifyContent: 'center',}}>
            <AwesomeButtonRick 
                style={metersStyles.sendMetersContainer}
                type="progress"
                size="small"
                backgroundColor="#30a969"
                backgroundDarker= "#1d653f"
                borderRadius ={13}
                textColor = "#414141"
                width={200}
                textSize={13}
                onPress={() => disabledButton ? this.validateForm() : this.uploadFiles(dataForUpload, false)}>
                Відправити показник
            </AwesomeButtonRick>
          </View>
          <TouchableOpacity 
            activeOpacity = { .5 } 
            onPress={() => this.props.navigation.navigate('UploadsManager', {
              updateImagesState: this.updateImagesState.bind(this),
              uploadFiles: this.uploadFiles.bind(this)
              }) 
            }
            style={metersStyles.showMetersContainer}
            >
              <Text style={metersStyles.showMetersText}>{i18next.t('show_uploaded_meters')}</Text>
          </TouchableOpacity>

        </KeyboardAvoidingView>
        <FlashMessage position="top" />
      </ScrollView>
    );
  }
}
