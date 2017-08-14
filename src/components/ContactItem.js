import React from 'react';
import { ListGroupItem, Button } from 'react-bootstrap';

export class ContactItem extends React.Component {

  //Callback prop from ContactList
  removeContact = () => {
    this.props.removeItem(this.props.contact.index)
  }

  //Callback prop from ContactList
  editContact = () => {
    this.props.getContact(this.props.contact.index)
  }

  render() {

    const contact = this.props.contact.contact;

    return (
     <ListGroupItem onClick={this.done}>
      <p>{contact.name} | {contact.surname} | {contact.email} </p>
      <p>{contact.telephone} <Button onClick={this.editContact} > EDIT </Button> <Button onClick={this.removeContact} > DELETE </Button></p>
     </ListGroupItem>
    );
  }
}
