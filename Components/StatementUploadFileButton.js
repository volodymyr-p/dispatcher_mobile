import React from 'react';
import {Button, AsyncStorage, TouchableOpacity, Text} from 'react-native';
import i18next from 'i18next';
import styles from '../stylesheets/MainStyles.style';

export class StatementUploadFileButton extends React.Component {

  onPressHandler = async () => {
    await this.DoneStatements(this.props.statement.id_statment);
    global.CurrentActiveStatement = null;
    AsyncStorage.removeItem('imageURIs');
    global.navigation.navigate('Main');
  }

  render() {
    return(
        <TouchableOpacity
            style={[styles.uploadButton]}
            onPress={() => this.props.chooseFile({ id_statment: this.props.statement.id_statment })}>
            <Text style={[styles.statementButtonText]}>{i18next.t('upload_button')}</Text>
        </TouchableOpacity>
    )
  }
}
