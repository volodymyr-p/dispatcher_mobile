import React, {Component} from 'react';
import {FlatList, View, Text, Image, ActivityIndicator, ScrollView, AsyncStorage} from 'react-native';
import i18next from 'i18next';
import styles from '../stylesheets/MainStyles.style';
import infoComponentStyles from '../stylesheets/StatementInfoComponent.style';
import Entypo from "react-native-vector-icons/Entypo";
import Lightbox from 'react-native-lightbox';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

export class UploadManager extends React.Component {
  _menu = [ ];

  hideMenu = (item) => {
      this._menu[item].hide();
  };

  showMenu = (item) => {
      this._menu[item].show();
  };

  deleteImage = async (imageName) => {
    await fetch(global.DOMAIN + `api/perfomer/deleteImage`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': global.token
      },
      body: JSON.stringify({
        image_name: imageName,
      })
    }).then(response => {
      if(response.ok){
        this.props.updateImagesState(imageName);
      }
    })
    .catch(error => console.log(error));
  }

  renderImageBlock = (imageData) => {
      return(
        <View style={{flexDirection: 'row', margin: 5, alignItems: 'center'}}>
          <Text style={infoComponentStyles.pictureNumberText}>#{imageData.index+1}</Text>
          <View style={{ width: 50}}>
            <Lightbox underlayColor="#656565">
              <Image
                style={{flex: 1, height: 50}}
                resizeMode = "contain"
                resizeMethod = "scale"
                source={{ uri: imageData.item.uri }}
              />
            </Lightbox>
          </View>
          {
            imageData.item.delayedUploadStatus
            ? <Entypo name="clock"
                style={infoComponentStyles.entypoIcons}
                size={25}
                color={'gray'}/>

            : imageData.item.uploadStatus 
            ? <Entypo name="check"
                style={infoComponentStyles.entypoIcons}
                size={25}
                color={'green'}/>

            : <ActivityIndicator size="small" color="gray" style={infoComponentStyles.activityIndicator} />
          }
          <View style={infoComponentStyles.menu}>
            <Menu
              ref={(menu) => { this._menu[imageData.item.uri] = menu }}
              button={
                <Entypo name="dots-three-vertical"
                  size={20}
                  color={'white'}
                  onPress={() => { this.showMenu(imageData.item.uri) }} 
                  />
              }
            >
              { 
                !imageData.item.uploadStatus 
                  ? <MenuItem onPress={() => {
                        this.props.uploadFiles(imageData.item, true, true);
                        this.hideMenu(imageData.item.uri);
                      }}>
                      {i18next.t('reload_image')}
                    </MenuItem> 
                  : null 
              }
              <MenuDivider color='black' />
              <MenuItem onPress={() => {
                this.hideMenu(imageData.item.uri);
                this.deleteImage(imageData.item.name);
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
    return(
      <View style={[styles.container]}> 
        {/* render upload manager title */}
        <View style={infoComponentStyles.uploadManagerView}>
          <Text style={infoComponentStyles.uploadManagerText}>{i18next.t('upload_manager')}</Text>
        </View>
        {
          this.props.imagesData.length === 0 ?
            <View style={infoComponentStyles.noPhotoInfoView}>
              <Text style={infoComponentStyles.noPhotoInfoText}>{i18next.t('there_no_images')}</Text>
              <Entypo name="camera" size={30} color={'#8f8f8f'}/>
            </View>
          : null
        }
        {/* render uploaded image */}
          <FlatList
              data={this.props.imagesData}
              renderItem={imageData => this.renderImageBlock(imageData)}
              ItemSeparatorComponent={this.FlatListItemSeparator}
              keyExtractor={(item, index) => index.toString()} />
      </View>
    );
  }
}
