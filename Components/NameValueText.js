import React, { Component } from 'react';
import { Text, View } from 'react-native';
import styles from '../stylesheets/MainStyles.style';

export class NameValueText extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.value || this.props.value == '')
      return (
        <View></View>
      )

    return (
      <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
        <Text style={[styles.white_text, { flex: 0.3 }]}>{this.props.name}</Text>
        <Text style={[styles.white_text, { flex: 0.7 }]}>{this.props.value}</Text>
      </View>
    );
  }
}
