import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import './App.css';
import {ContactsList} from './components/ContactsList.js';

class App extends Component {

  render() {

    const CONTACTS = JSON.parse(localStorage.getItem('contacts')) || [];

    return (

      <Grid>
        <Row className="show-grid">
          <Col xs={12} md={12} >
            <ContactsList contacts={CONTACTS} />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default App;
