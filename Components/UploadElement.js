import React, { Component, useState } from 'react';
import { Text, View, Alert, Button, TouchableOpacity, Modal } from 'react-native';
import MarqueeText from 'react-native-marquee';
import { uploadFiles } from '../Code/UploadFiles';
import styles from '../stylesheets/MainStyles.style';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import i18next from 'i18next';

export default UploadElement = (props) => {
  //Convert bytes to kb, mb, gb
  const formatBytes = (a, b) => { if (0 == a) return "0 Bytes"; var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f] }

  let headerName = "";
  if (props.data.item.additionalInfo.hasOwnProperty('counter_number'))
    headerName = `${i18next.t('counter')} ${props.data.item.additionalInfo.counter_number} ${props.data.item.date}`
  else
    headerName = `${i18next.t('statement')} ${props.data.item.additionalInfo.id_statment}`

  return (
    <View style={{ width: '90%', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
      {/* Head */}
      <View style={styles.sectionHeader}>
        <MarqueeText
          style={{ fontSize: 20, color: '#fff', width: '80%' }}
          duration={3000}
          marqueeOnStart
          loop
          marqueeDelay={1000}
          marqueeResetDelay={1000}
        >{headerName}</MarqueeText>
        <TouchableOpacity
          style={{ marginLeft: 'auto', marginRight: 10 }}
          onPress={() => {
            // alert(JSON.stringify(props.data.item.results));
            uploadFiles(props.data.item.additionalInfo, props.data.item.results, 'files', (p) => console.log(p));
          }} >
          <FontAwesome name="upload" size={30} color={'#fff'} />
        </TouchableOpacity>
      </View> 

      {/* Body */}
      <View style={{width: '80%', borderRadius: 5, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', backgroundColor: '#919191'}}>
        {props.data.item.results.map((val, index) => {
          return (
            <View style={{ justifyContent: 'flex-start', width: '100%' }} key={index}>
              <Text style={{ color: '#fff', marginLeft: '10%' }}>{val.name}   {formatBytes(val.size)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}