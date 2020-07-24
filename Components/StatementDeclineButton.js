import React from 'react';
import { View, Modal, Button, TextInput, AsyncStorage, TouchableOpacity, Text} from 'react-native';
import i18next from 'i18next';
import styles from '../stylesheets/MainStyles.style';

export class StatementDeclineButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
  }

  async DeclineStatements(id_statment, statementRefuseText) {
    await fetch(global.DOMAIN + `api/perfomer/refuse`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': global.token
      },
      body: JSON.stringify({id: id_statment, refuseReason: statementRefuseText})
    }).catch(error => console.log(error));
  }

   onPressHandler = async () => {
    await this.DeclineStatements(this.props.statement.id_statment, this.state.statementRefuseText);
    if(global.CurrentActiveStatement && global.CurrentActiveStatement.id_statment == this.props.statement.id_statment) global.CurrentActiveStatement = null
    AsyncStorage.removeItem('imageURIs'); 
    global.navigation.navigate('Main');
  }

  render() {
    return (
      <View>
          <TouchableOpacity 
              style={[styles.declineButton]}
              onPress={() => { this.setState({modalVisible: true}); }}>
              <Text style={[styles.statementButtonText]}>{i18next.t('decline_button')}</Text>
          </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}>
          <View style={styles.modal}>
            <TextInput
              style={styles.modalTextInput}
              multiline
              underlineColorAndroid="transparent"
              placeholder={i18next.t('reason_for_refuse')}
              autoCapitalize="none"
              onChangeText={(text) =>this.setState({ statementRefuseText: text })}/>
            <View style={styles.buttonContainer}>
              <Button
                  title={i18next.t('cancel')}
                  color="gray"
                  onPress={() => { this.setState({modalVisible: false}); }} />
              <Button
                title={i18next.t('decline_button')}
                color="#FF4040"
                onPress={this.onPressHandler}/>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}