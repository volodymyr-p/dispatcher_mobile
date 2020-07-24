"use strict"
import React from 'react';
import i18next from 'i18next';
import StatementInfoComponent from '../Components/StatementInfoComponent';

class StatementInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statement: this.props.navigation.state.params.statement,
      statementRefuseText: null
    };
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: i18next.t('statement') + navigation.state.params.statement.id_statment
    };
  };

  render() {
    return (<StatementInfoComponent statement={this.state.statement}/>)
  }
}

export default StatementInfo;