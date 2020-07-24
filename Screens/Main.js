'use strict';
import React, {Component} from 'react';
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  AppState
} from 'react-native';
import Statement from '../Components/Statement';
import i18next from 'i18next';
import styles from '../stylesheets/MainStyles.style';
import AsyncStorage from '@react-native-community/async-storage';
import {GetCurrentActiveStatement} from '../Code/FetchFunctions';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statement: [],
      modalVisible: false,
      statementRefuseText: '',
      idStatementForModal: null,
      loading: true,
    };
    // fetching statements for the first time
    this.getStatements();
  }

  static navigationOptions = () => {
    return {
      title: 'Робоча зона',
    };
  };
  
  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.getStatements();
    })
    AppState.addEventListener('change', this._handleAppStateChange);
    await GetCurrentActiveStatement();
  }

  _handleAppStateChange = (nextAppState) => {
    if(nextAppState === 'active'){
      this.getStatements();
    }
  }

  exit = async () => {
    await AsyncStorage.multiRemove(['login', 'token', 'password']);
    this.props.navigation.navigate('Login');
  };

  getStatements = async () => {
    this.setState({loading: true});

    const token = await AsyncStorage.getItem('token');

    fetch(global.DOMAIN + 'api/perfomer/getTable', //will be api/perfomer/statements
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: global.token,
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        if(responseJson) {
          responseJson.map(el => {
            if (el.id_statement_status === 3) {
              global.CurrentActiveStatement = el;
            }
          });
        } 

        this.setState({
          statement: responseJson,
          loading: false,
        });
      })
      .catch(error => console.log(error));

    this.setState({loading: false});
  };

  renderItem = ({item}) => {
    return <Statement statement={item} />;
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  // проблеми з модальним вікном, коли швидко вводити багато тексту, апка ребілдиться,
  // можливо проблема в емуляторі треба потестити на телефоні
  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0c9" />
        </View>
      );
    }

    if (this.state.statement.length !== 0) {
      return (
        <View style={styles.container}>
          <FlatList
            style={{width: '100%'}}
            refreshControl={
              <RefreshControl
                //refresh control used for the Pull to Refresh
                refreshing={this.state.loading}
                onRefresh={() => this.getStatements()}
              />
            }
            data={this.state.statement}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={() => this.getStatements()}
            />
          }>
          <Text style={{marginTop: '55%', marginLeft: '30%', color: '#B5B8B1'}}>
            {i18next.t('no_statements_to_show')}
          </Text>
        </ScrollView>
      </View>
    );
  }
}

export default Main;
