import React from 'react';
import {View, Button, TouchableOpacity, Text} from 'react-native';
import i18next from 'i18next';
import styles from '../stylesheets/MainStyles.style';

export class StatementAcceptButton extends React.Component {
  constructor(props) {
    super(props);    
    this.state = {accepted:false};
  }

  async AcceptStatements(statement) {
    this.props.setLoadingStatus(true);

    fetch(global.DOMAIN + `api/perfomer/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': global.token
      },
      body: JSON.stringify({id: statement.id_statment})
    })
    .then(data => {
      if(data.ok){
        this.setState({accepted : true});
        this.props.setLoadingStatus(false);
      } else {
        alert('Some error ocured...');
      }
    })
    .catch(error => console.log(error));
  }

  onPressHandler = () => {
    this.AcceptStatements(this.props.statement);
    global.CurrentActiveStatement = this.props.statement
  }

  render() {
    if(this.state.accepted) return (<View></View>)
    
    return (<TouchableOpacity
              style={[styles.acceptButton]}
              onPress={this.onPressHandler}>
              <Text style={[styles.statementButtonText]}>{i18next.t('accept_button')}</Text>
            </TouchableOpacity>
      );
  }
}
