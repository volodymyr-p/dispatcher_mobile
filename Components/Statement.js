"use strict"
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../stylesheets/MainStyles.style';

 class Statement extends React.Component {
  constructor(props) {
    super(props);
  }

  formAddress(item){
    let addres = '';
    if (item.city !== null && item.city !== "") {
      addres += 'м.' + item.city
    };
    if (item.street !== null && item.street !== "") {
      addres += ', вул.' + item.street
    };
    if (item.house !== null && item.house !== "") {
      addres += ', буд.' + item.house
    };
    if (item.entrance !== null && item.entrance !== "") {
      addres += ', під\'їзд.' + item.entrance
    };
    if (item.apartment !== null && item.apartment !== "") {
      addres += ', кв.' + item.apartment
    };
    return addres;
  }

  render() {
    let statement = this.props.statement
    
    let address = this.formAddress(statement)

    let dateHours = new Date(statement.date_create).toLocaleDateString()
    let dateDays = new Date(statement.date_create).toLocaleTimeString();

    let current_style = styles.card;
    if(global.CurrentActiveStatement && global.CurrentActiveStatement.id_statment == statement.id_statment) current_style = styles.card_success
    return (
      <TouchableOpacity onPress={() => global.navigation.navigate('StatementInfo', { statement: statement })}>
          <View style={current_style}>
          <Text style={styles.white_text}>{statement.variety_name}</Text>
          <Text style={styles.white_text}>{statement.malfunction_name}</Text>
          <Text style={styles.white_text}>{dateHours} {dateDays}</Text>
          <Text style={styles.white_text}>{address}</Text>
          <Text style={styles.white_text_center}>Детальніше >></Text>
        </View>
      </TouchableOpacity>
    );
   }
}

export default Statement;