import React from 'react';
import { View,  AsyncStorage,  ActivityIndicator } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import wifi from 'react-native-android-wifi';

import styles from '../stylesheets/MainStyles.style';
import { StatementAcceptButton } from '../Components/StatementAcceptButton';
import { StatementDeclineButton } from '../Components/StatementDeclineButton';
import { StatementDoneButton } from '../Components/StatementDoneButton';
import { StatementUploadFileButton } from '../Components/StatementUploadFileButton';
import { UploadManager } from '../Components/UploadManager';
import { NameValueText } from '../Components/NameValueText'


class StatementInfoComponent extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      statement: this.props.statement,
      progress: 0,
      showDoneButton: false, //show done after lock->unlock
      imagesData: [],
      uploadStatus: false,
      loading: false
    };

    this.AcceptButtonHandler = this.AcceptButtonHandler.bind(this);
    this.chooseFile = this.chooseFile.bind(this);
    this.updateImagesState = this.updateImagesState.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
  }

  async componentDidMount() {
    const loadUsingOnlyWIFI = JSON.parse(await AsyncStorage.getItem('loadJustOnWIFI'));
    global.loadUsingOnlyWIFI = loadUsingOnlyWIFI;

    const images = JSON.parse(await AsyncStorage.getItem('imageURIs'));
    let imagesData = null;

    if(!!images){
      imagesData = images.filter((imageData) => { 
        return imageData.id_statment == this.state.statement.id_statment
      })
    }

    // used to retry upload pictures which haven`t been uploaded yet 
    if(!!imagesData){
      imagesData.map(image => {
        if(!image.uploadStatus || image.delayedUploadStatus){
          this.uploadFiles(image, true);
        }
      })
    }

    // need when AsyncStorage return undefined (when AsyncStorage doesn`t have uri)
    if(!imagesData){
      imagesData = []
    }

    this.setState({
      loadUsingOnlyWIFI,
      imagesData 
    })
  }

  // TODO: rewrite with using id_uploaded_file instead file_name
  chooseFile = async (statement) => {
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
      } else if (response.uri) {
          const source = { 
            uri: response.uri, 
            type: response.type, 
            name : response.fileName, 
            id_statment : statement.id_statment, 
            uploadStatus: false 
          };
        this.uploadFiles(source, false);
      }
    });
  }
  
  // TODO: rewrite with using id_uploaded_file instead file_name
  uploadFiles = async (source, isReload, forceLoad) => {

    const {imagesData } = this.state;
    const loadUsingOnlyWIFI = global.loadUsingOnlyWIFI;

    const token = await AsyncStorage.getItem('token');

    let data = new FormData();
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
      name: source.name, 
      id_statment: source.id_statment, 
      uploadStatus: false,
      delayedUploadStatus: loadUsingOnlyWIFI
    }

    // used to prevent repeating images while reloading them
    if(!isReload){
      this.setState(prevState => ({
        imagesData: [...prevState.imagesData, newImageData]
      }), function () {
        this.saveImageDataToAS(imagesData);
      })
    }

    // user can force-push photo from menu (independent from settings and connection)
    if(forceLoad){
      this.axiosRequest(token, data, source);
      return;
    }

    wifi.isEnabled((isEnabled) => {
      if (isEnabled) {
        wifi.connectionStatus((isConnected) => {
          if(isConnected) {
            // Device is connected to wifi and uploading only using wifi
            this.axiosRequest(token, data, source);
          } else {
            if (!loadUsingOnlyWIFI) {
              // Device is not connected to wifi but settings allow to upload
              this.axiosRequest(token, data, source);
            } else {
              // Device not connected to wifi and setting banned upload witout wifi
              this.changeImageStatus('uploadStatus', false, source);
              this.changeImageStatus('delayedUploadStatus', true, source);
            }
          }
        });
      }
    })
  }

  saveImageDataToAS = (data) => {
    AsyncStorage.setItem('imageURIs', JSON.stringify(this.state.imagesData));
  }

  axiosRequest = (token, data, source) => {
    axios.request({
      method: "post",
      url: `${global.DOMAIN}files`,
      headers: {
        Accept: "application/x-www-form-urlencoded",
        Authorization: token,
      },
      data: data,
      onUploadProgress: (progressEvent) => {
        const uploadSt = (Math.round((progressEvent.loaded * 100) / progressEvent.total));
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
        imagesData: prevState.imagesData.map((imageData) => {
          if (imageData.uri === source.uri) {

            if(statusType === 'uploadStatus'){
              return { ...imageData, uploadStatus: status };
            }

            if(statusType === 'delayedUploadStatus'){
              return { ...imageData, delayedUploadStatus: status };
            }

          } else {
            return imageData;
          }
        }),
      };
    }, function () {
        this.saveImageDataToAS(this.state.imagesData);
      })
  }

  formAddress(item) {
    let addres = '';
    if (item.city !== null && item.city !== "") {
      addres += 'м.' + item.city
    };
    if (item.street !== null && item.street !== "") {
      addres += ', вул.' + item.street
    };
    if (item.house !== null && item.house !== "") {
      addres += ', буд.' + item.house
    };
    if (item.entrance !== null && item.entrance !== "") {
      addres += ', під\'їзд.' + item.entrance
    };
    if (item.apartment !== null && item.apartment !== "") {
      addres += ', кв.' + item.apartment
    };
    return addres;
  }

  formatContactInfo = (item) => {
    let contactInfo = '';
    if (item.mobile_phone !== null && item.mobile_phone !== "") {
      contactInfo += 'моб. ' + item.mobile_phone
    };
    if (item.email !== null && item.email !== "") {
      contactInfo += ' ' + item.email
    };
    return contactInfo;
  }

  AcceptButtonHandler = (loadingStatus) => {
    this.setState({
      loading: loadingStatus
    })
  }

  updateImagesState = (imageName) => {
    this.setState({
      imagesData: this.state.imagesData.filter((imageData) => { 
          return imageData.name !== imageName
        })
    },function () {
        this.saveImageDataToAS(this.state.imagesData);
    });
  }

  render() {
    const { imagesData } = this.state
    const item = this.state.statement;

    const contactInfo = this.formatContactInfo(item)
    const address = this.formAddress(item)

    const dateHours = new Date(item.date_create).toLocaleDateString();
    const dateDays = new Date(item.date_create).toLocaleTimeString();

    //what buttons need
    let showAcceptButton = false
    let showDoneButton = false
    let showDeclineButton = true //отклонить можно всегда
    let showUploadButton = false

    //любую заявку можно принять или отклонить сразу (если другая не в работе)
    if (!global.CurrentActiveStatement) {
      showAcceptButton = true;
    } else {
      //заявку в работе можно исполнить или отклонить +прикрепить фото
      if (global.CurrentActiveStatement.id_statment == item.id_statment) {
        showDoneButton = true
        showUploadButton = true
      } else
        showAcceptButton = false
    }
    //если была блокировка
    showDoneButton = showDoneButton || this.state.showDoneButton
    //если в работе не текущая заявка то ее можно только отклонить
    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0c9" />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <View>
            <View style={styles.card}>
              <NameValueText name={i18next.t('statementId')} value={item.statement_number}></NameValueText>
              <NameValueText name={i18next.t('dateCreated')} value={dateHours + ',   ' + dateDays}></NameValueText>
              <NameValueText name={i18next.t('statementName')} value={item.variety_name}></NameValueText>
              <NameValueText name={i18next.t('subscriberName')} value={item.abonent}></NameValueText>
              <NameValueText name={i18next.t('contactInfo')} value={contactInfo}></NameValueText>
              <NameValueText name={i18next.t('addres')} value={address}></NameValueText>
              <NameValueText name={i18next.t('additionalInfo')} value={item.additional_info}></NameValueText>
            </View>
            <View style={styles.buttonContainer}>
              {showAcceptButton ? <StatementAcceptButton statement={item} setLoadingStatus={this.AcceptButtonHandler}/> : null}
              {showDoneButton ? <StatementDoneButton statement={item} /> : null}
              {showDeclineButton ? <StatementDeclineButton statement={item} /> : null}
              {showUploadButton ? <StatementUploadFileButton statement={item} chooseFile={this.chooseFile}/> : null}    
            </View>
          </View>
          {
            global.CurrentActiveStatement && global.CurrentActiveStatement.id_statment == item.id_statment ?
            <UploadManager imagesData={imagesData} updateImagesState={this.updateImagesState} uploadFiles={this.uploadFiles}/> : null
          }
        </View>
      )
    }
  }
}

export default StatementInfoComponent;