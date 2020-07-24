import React, {Component} from 'react';
import {FlatList, View, Text, Image, ActivityIndicator, ScrollView, AsyncStorage} from 'react-native';
import i18next from 'i18next';
import styles from '../stylesheets/MainStyles.style';
import infoComponentStyles from '../stylesheets/StatementInfoComponent.style';
import Entypo from "react-native-vector-icons/Entypo";
import Lightbox from 'react-native-lightbox';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import managerStyles from "../stylesheets/UploadsManagerStyles";

export default class UploadsManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      metersData: [],
      uploadStatus: false,
      loading: false
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: i18next.t('submitted_meters'),
    };
  };

  async componentDidMount() {
    const metersData = JSON.parse(await AsyncStorage.getItem('imageMetersURIs'));
    this.setState({ metersData });
  }

  _menu = [ ];

  hideMenu = (item) => {
      this._menu[item].hide();
  };

  showMenu = (item) => {
      this._menu[item].show();
  };

  deleteImage = async (imageName) => {
    const { params } = this.props.navigation.state;
    await fetch(global.DOMAIN + `api/perfomer/MetersPhotoDelete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': global.token
      },
      body: JSON.stringify({
        image_name: imageName,
      })
    }).then(params.updateImagesState(imageName))
    .catch(error => console.log(error));
  }

  reloadImage = (source, isReload, forceLoad) => {
    const { params } = this.props.navigation.state;
    params.uploadFiles(source, isReload, forceLoad)
  }

  addressFormatting(item){
    let address = ``;
    item.city ? address += `м. ${item.city},` : null;
    item.street ? address += ` вул. ${item.street},` : null;
    item.house_number ? address += ` буд. ${item.house_number},` : null;
    item.flat_number ? address += ` кв. ${item.flat_number}` : null;

    return address;
  }

  renderImageBlock = (meterData) => {
    const { params } = this.props.navigation.state
      return(
        <View style={managerStyles.imageBlockContainer}>
          <Text style={infoComponentStyles.pictureNumberText}>#{meterData.index+1}</Text>
          <View style={managerStyles.lightboxContainer}>
            <Lightbox underlayColor="#656565">
              <Image
                style={managerStyles.lightboxImage}
                resizeMode = "contain"
                resizeMethod = "scale"
                source={{ uri: meterData.item.uri }}
              />
            </Lightbox>
          </View>
          <View style={managerStyles.meterAddressTextContainer}>
            <Text style={managerStyles.meterAddressText}>{this.addressFormatting(meterData.item)}</Text>
          </View>
          {
            meterData.item.delayedUploadStatus
            ? <Entypo name="clock"
                style={infoComponentStyles.entypoIcons}
                size={25}
                color={'gray'}/>

            : meterData.item.uploadStatus 
            ? <Entypo name="check"
                style={infoComponentStyles.entypoIcons}
                size={25}
                color={'green'}/>

            : <ActivityIndicator size="small" color="gray" style={infoComponentStyles.activityIndicator} />
          }
          <View style={infoComponentStyles.menu}>
            <Menu
              ref={(menu) => { this._menu[meterData.item.uri] = menu }}
              button={
                <Entypo name="dots-three-vertical"
                  size={20}
                  color={'white'}
                  onPress={() => { this.showMenu(meterData.item.uri) }} 
                  />
              }
            >
              { 
                !meterData.item.uploadStatus 
                  ? <MenuItem onPress={() => {
                        this.reloadImage(meterData.item, true, true);
                        this.hideMenu(meterData.item.uri);
                      }}>
                      {i18next.t('reload_image')}
                    </MenuItem> 
                  : null 
              }
              <MenuDivider color='black' />
              <MenuItem onPress={() => {
                this.hideMenu(meterData.item.uri);
                this.deleteImage(meterData.item.name);
                }}>
                {i18next.t('delete')}
              </MenuItem>
            </Menu>
          </View>
        </View>
      );
  }

  FlatListItemSeparator = () => {
    return ( <View style={infoComponentStyles.flatListItemSeparator}/> );
  }

  render() {
    const { metersData } = this.state;
    return(
      <View style={[styles.container]}> 
        {
          metersData === null || metersData.length === 0 ? 
            <View style={infoComponentStyles.noPhotoInfoView}>
              <Text style={infoComponentStyles.noPhotoInfoText}>{i18next.t('there_no_images')}</Text>
              <Entypo name="camera" size={30} color={'#8f8f8f'}/>
            </View>
          : null
        }
        {/* render uploaded image */}
          <FlatList
              data={metersData}
              renderItem={meterData => this.renderImageBlock(meterData)}
              ItemSeparatorComponent={this.FlatListItemSeparator}
              keyExtractor={(item, index) => index.toString()} />
      </View>
    );
  }
}



