import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styles from '../stylesheets/MainStyles.style';
import { ScrollView, Text, View, Image, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { EndWork } from '../Screens/StartWorkingButton';
import i18next from 'i18next';

class SideMenu extends Component {
  render() {
    return (
      <View style={styles.menuContainer}>
        <ImageBackground source={require('../assets/SideMenuImg/black_background.jpg')} style={styles.headerContainer}>
        </ImageBackground>
        <ScrollView>
          {/* TODO: Hide if not active */}
          <TouchableOpacity activeOpacity={0.5} onPress={() => { EndWork() }}>
            <View style={styles.navItemStyle} >
              <Image source={require('../assets/SideMenuImg/end_shift_icon.png')} style={styles.sideMenuIcon} />
              <Text style={styles.menuText}> {i18next.t('end_working_shift')} </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5} onPress={() => this.props.navigation.navigate('MeterReadings')}>
            <View style={styles.navItemStyle}>
              <Image source={require('../assets/SideMenuImg/indicator.png')}style={styles.sideMenuIcon} />
              <Text style={styles.menuText}> {i18next.t('meter_readings')} </Text>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity activeOpacity={0.5} onPress={() => this.props.navigation.navigate('UploadsManager')}>
            <View style={styles.navItemStyle} >
              <AntDesign name="clouduploado" size={30} style={{ marginLeft: 20, marginRight: 10 }} />
              <Text style={styles.menuText}> {i18next.t('uploads_manager')} </Text>
            </View>
          </TouchableOpacity> */}
        </ScrollView>
        <View style={styles.navSectionStyle}>
          <TouchableOpacity activeOpacity={0.5} onPress={() => { this.props.navigation.navigate('Settings', { pageName: i18next.t('settings') }) }}>
            <View style={[styles.footerContainer, { backgroundColor: '#5c8694' }]}>
              <Image source={require('../assets/SideMenuImg/settings.png')}
                style={styles.sideMenuIcon} />
              <Text>{i18next.t('settings')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

export default SideMenu;