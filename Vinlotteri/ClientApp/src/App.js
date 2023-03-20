import React, { Component } from 'react';

import './custom.css'
import {TicketTable} from "./components/TicketTable";

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
        <TicketTable></TicketTable>
    );
  }
}
