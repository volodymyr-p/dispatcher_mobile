import React, { Component } from "react";
import { View, Text, Button, Alert, Platform, AsyncStorage } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import axios from 'axios';

export async function CheckInternetConnection() {
    const state = await NetInfo.fetch();
    if(state.isConnected){
        return true;
    } else {
        return false;
    }
};

export async function UploadMetersPhoto() {
    const metersData = JSON.parse(await AsyncStorage.getItem('imageMetersURIs'));
    const loadUsingOnlyWIFI = JSON.parse(await AsyncStorage.getItem('loadJustOnWIFI'));
    if(!!metersData){
      metersData.map(image => {
        if(!image.uploadStatus || image.delayedUploadStatus){
            NetInfo.fetch().then(state => {
                if(state.type === 'wifi') {
                    // Device is connected to wifi and uploading only using wifi
                    axiosRequest(image);
                } else if (!loadUsingOnlyWIFI) {
                    // Device is not connected to wifi but settings allow to upload
                    axiosRequest(image);
                }
            });
        }
      })
    }  
};

axiosRequest = async (source) => {
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

    await axios.request({
        method: "post",
        url: `${global.DOMAIN}counters/upload`,
        headers: {
        Accept: "application/x-www-form-urlencoded",
        Authorization: token,
        },
        data: data,
        onUploadProgress: (progressEvent) => {
            const uploadSt = (Math.round((progressEvent.loaded * 100) / progressEvent.total));
            if(uploadSt === 100){
                AsyncStorage.getItem( 'imageMetersURIs' )
                    .then( data => {
                        let _data = JSON.parse(data);
                        _data.forEach(el => {
                            if(el.uri === source.uri) {
                                el.delayedUploadStatus = false;
                                el.uploadStatus = true;
                            }
                        });
                        AsyncStorage.setItem( 'imageMetersURIs', JSON.stringify(_data ) );
                    }).done();
            }
        }
    }).catch(err => {
        console.log(err)
    });
}    