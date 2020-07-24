import React, { Component } from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from '@react-native-community/checkbox';
import MarqueeText from 'react-native-marquee';
import Menu, { MenuItem } from 'react-native-material-menu';
import styles from '../stylesheets/MainStyles.style';
import i18next from 'i18next';
import RNRestart from 'react-native-restart';
import { color } from 'react-native-reanimated';
import { DeleteFCMToken } from '../Code/FetchFunctions';
import { ChangeLoginStatus, DeleteToken } from '../Code/Token'

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      currentLang: false,
    };
  }

  async componentDidMount() {
    let checked = JSON.parse(await AsyncStorage.getItem('loadJustOnWIFI'));
    let currentLang = await AsyncStorage.getItem('language');

    this.setState({
      checked: JSON.parse(checked),
      currentLang: currentLang,
    });
  }

  logOut = () => {
    Alert.alert(
    i18next.t('exitt'),
    i18next.t('do_you_wanna_exit'),
      [
        {
          text: i18next.t('no'),
          onPress: () => this.props.navigation.navigate('Main'),
            style: 'cancel',
          },
        {
          text: i18next.t('exitt'), onPress: async () => {
            await ChangeLoginStatus(false);
            await DeleteFCMToken();
            await DeleteToken();
            await AsyncStorage.removeItem('isLogged');
            await AsyncStorage.removeItem('delayed_uploads');
            this.props.navigation.navigate('Login');
          }
        },
      ],
      { cancelable: false },
    )
  }

  langRef = null;
  setNewLang = async lang => {
    await AsyncStorage.setItem('language', lang);

    this.setState({
      currentLang: lang
      });

    setTimeout(() => RNRestart.Restart(), 200);
  };

  askAboutChangeLng = lang =>
  {
    this.langRef.hide();

    Alert.alert(
      i18next.t('need_to_reload_to_change_lng'),
      i18next.t('do_it_now'),
      [
        {
          text: i18next.t('cancel'),
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.setNewLang(lang)},
      ],
      {cancelable: false},
    );
  }

  reloadApp = () => {
    setTimeout(() => RNRestart.Restart(), 1000); //waiting langRef.hide()
  }

 render() {
    return (
      <View style={styles.container}>
        <View style={{width: '100%'}}>
          <Menu
            ref={ref => (this.langRef = ref)}
            button={
              <View>
                <Text style={styles.label}>
                  {i18next.t('language')}
                </Text>
                <TouchableOpacity
                  style={styles.settingsSelector}
                  activeOpacity={0.5}
                  onPress={() => {
                    this.langRef.show();
                  }}>
                  <View style={{ width: '100%' }}>
                    <Text style={{paddingLeft: 20, color: 'white'}}>
                      { this.state.currentLang === 'en' ? 'English': this.state.currentLang === 'ru' ? 'Русский' : 'Українська' }
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              }>
            <MenuItem onPress={() => { this.askAboutChangeLng('en') }}>English</MenuItem>
            <MenuItem onPress={() => { this.askAboutChangeLng('uk') }}>Український</MenuItem>
            <MenuItem onPress={() => { this.askAboutChangeLng('ru') }}>Русский</MenuItem>

          </Menu>
        </View>
        
        <View>
          <Text style={styles.label}> {i18next.t('save_traffic')} </Text>
          <View style={{ flexDirection: 'row', paddingRight: 40, paddingLeft: 20, paddingBottom: 20 }}>
            <Text style={styles.white_text}>{i18next.t('load_just_on_wifi')}</Text>
            <CheckBox
              value={this.state.checked}
              onValueChange={async () => {
                await AsyncStorage.setItem('loadJustOnWIFI', JSON.stringify(!this.state.checked));
                this.setState({ checked: !this.state.checked });
              }}
            />
          </View>
        </View>

        <TouchableOpacity 
          activeOpacity={0.5}  
          style={{
            backgroundColor: 'gray',  
            marginTop: 40
          }} 
            onPress={() => {
            this.logOut();
          }}>
            <View style={styles.navItemStyle} >
              <Image source={require('../assets/SideMenuImg/exit.png')}
                style={styles.sideMenuIcon} />
              <Text style={styles.menuText}>{i18next.t('log_out')}</Text>
            </View>
          </TouchableOpacity>
      </View>
    );
  }
}