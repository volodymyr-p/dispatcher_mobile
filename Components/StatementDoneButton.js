import React from 'react';
import {Button, AsyncStorage, TouchableOpacity, Text} from 'react-native';
import i18next from 'i18next';
import styles from '../stylesheets/MainStyles.style';

export class StatementDoneButton extends React.Component {
  async DoneStatements(id_statement) {
    fetch(global.DOMAIN + `api/perfomer/done`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': global.token
      },
      body: JSON.stringify({id: id_statement})
    }).catch(error => console.log(error));
  }

  onPressHandler = async () => {
    await this.DoneStatements(this.props.statement.id_statment);
    global.CurrentActiveStatement = null;
    AsyncStorage.removeItem('imageURIs');
    global.navigation.navigate('Main');
  }

  render() {
    return(
      <TouchableOpacity
        style={[styles.doneButton]}
        onPress={this.onPressHandler }>
        <Text style={[styles.statementButtonText]}>{i18next.t('done_button')}</Text>
      </TouchableOpacity>
    )
  }
}
