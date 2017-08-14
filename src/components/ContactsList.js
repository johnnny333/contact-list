import React from 'react';
import {ContactItem} from './ContactItem.js';
import {ContactForm} from './form/ContactForm.js';
import { Panel,Grid, Row, Col, ListGroup, Button, Glyphicon, Pagination } from 'react-bootstrap';

export class ContactsList extends React.Component {

  constructor(props) {
    super();

    this.state = {
      contacts: props.contacts, contactEdit: null, activePage: 1
    };
  }

  addContact = (contact) => {
    this.setState ( (prevState) => ({
      contacts: [...prevState.contacts, {contact} ]
    }), () => {this.setLocalStorage()}
    )
  }

 removeContact = (index) => {

    this.getContact(index, true)

    this.setState((prevState) => ({
      contacts: [...prevState.contacts.slice(0,index), ...prevState.contacts.slice(index+1)]
    }), () => {this.setLocalStorage()}
    )
  }

  updateContact = (contact) => {

    this.state.contacts[contact.index].contact = contact;
    this.setState ( (prevState) => ({

      contacts: [...this.state.contacts ]

    }), () => {this.setLocalStorage()}
    )
  }

  setLocalStorage = () => {
    localStorage.setItem('contacts', JSON.stringify( [...this.state.contacts ]));
  }

  //Get edit contact from ContactItem or if contactToDelete is set,
  // mind contact form to clear its fields
  getContact = (contactIndex, contactToDelete) => {
    let editContact = this.state.contacts[contactIndex].contact;
    editContact.index = contactIndex;

    if(contactToDelete){
      editContact.toRemoved = true;
    }

    this.setState({contactEdit: editContact});
  }

  //Remove temporary edit contact from state
  removeEditContact = () => {
    this.setState({contactEdit: null});
  }

  handleSelect = (eventKey) => {
    console.log(eventKey);
    this.setState({
      activePage: eventKey
    });
  }

  componentDidUpdate(prevProps, prevState){

    //Watch for situation when user delete list item in a page > 1.
    // If this occurs, decrement activa page field state.
    if((this.state.contacts.length <= (this.state.activePage - 1) * 10) && this.state.activePage > 1){
        console.log("in render");

        this.setState((prevState) => {
          return {activePage: prevState.activePage - 1};
        });
    }

  }

  render() {

    const {activePage} = this.state, positionStart = (activePage - 1) * 10,
      positionEnd = activePage * 10;

    return (

        <Grid>
          <Row className="show-grid">
          {this.state.contacts.length}
            <Panel>
              <Col xs={12} md={8}>
                <ListGroup>
                  {this.state.contacts.map((contact, index) =>
                    index >= (positionStart) && index < (positionEnd) ? <ContactItem key={index}  contact={{...contact, index}} getContact={this.getContact} removeItem={this.removeContact}/> : null
                  )}
                </ListGroup>

                <div className="text-center" style={{visibility: this.state.contacts.length > 10 ? "visible" : "hidden" }}>
                  <Pagination
                    bsSize="medium"
                    items={Math.ceil(this.state.contacts.length/10)}
                    activePage={this.state.activePage}
                    onSelect={this.handleSelect} />
                  <br />
                </div>

              </Col>

              <Col xs={6} md={4}>
                <ContactForm addContact={this.addContact} contactEdit={this.state.contactEdit}
                  removeEditContact={this.removeEditContact} updateContact={this.updateContact}
                />
              </Col>
            </Panel>
          </Row>
        </Grid>

    );
  }
}
