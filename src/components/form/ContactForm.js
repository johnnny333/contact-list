import React from 'react';
import { Form, FormGroup, ControlLabel, FormControl,  HelpBlock, Button } from 'react-bootstrap';

export class ContactForm extends React.Component {

  constructor(props) {
    super();

    this.state =  {
      email: '',
      telephone: '',
      name: '',
      surname: '',
      formErrors: {
        email: '', telephone: '', name: '', surname: ''
      },
      valids: {
        emailValid: false, telephoneValid: false, nameValid: false,
        surnameValid: false, formValid: false,
      },
      contact: {}
    };
  }

  //Assign edited contact values
  componentWillReceiveProps(nextProps) {
    if(nextProps.contactEdit !== null){

      const {contactEdit} = nextProps;

      this.setState({contact: contactEdit})

      //Remove currently edited contact from ContactList state
      nextProps.removeEditContact()

      if(contactEdit.toRemoved){
        this.resetValids();
      } else {
        this.resetValids(contactEdit,true);
      }

    }
  }

  //Sets form fields to either show edited contact
  // or clean them fields
  resetValids = (contactEdit, value) => {

    let {valids} = this.state, state = this.state;

    if(contactEdit === undefined) {
      for (let key in state) {
        if (state.hasOwnProperty(key) && typeof state[key] !== 'object' ) {
          state[key] = '';
        }
      }
    }

    for (let keyValid in valids) {
      if (valids.hasOwnProperty(keyValid)) {
        valids[keyValid] = value;
      }
    }

    let fields = contactEdit === undefined ? state : contactEdit;

    this.setState((prevState) => (
      {...fields, valids }
      )
    )

    if(contactEdit === undefined){
        this.setState({contact:{}})
    }

  }

  handleUserInput = (e) => {
    const name = e.target.name, value = e.target.value, type = e.target.type;
    this.setState({[name]: value}, () => { this.validateField(name, value, type) });
  }

  validateField(fieldName, value, type) {
    let fieldValidationErrors = this.state.formErrors,
    fieldValids = this.state.valids,
    isValid, hint;

    switch(type) {

      case 'text':
        isValid = value.length > 2;
        hint = isValid ? '' : 'Input must be at least 3 characters long';
        break

      case 'email':
        isValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        hint = isValid ? '' : 'Provide legitimate email';
        break;

      case 'tel':
        isValid = value.length >= 9 && value.match(/^\d+$/);
        hint = isValid ? '': ' Must be at least 9 numbers long';
        break;

      default:
        break;
    }

    this.setState((prevState) => ({
      fieldValids: Object.assign({}, prevState.valids, fieldValids[fieldName  + "Valid"] = isValid ) ,
      fieldValidationErrors: Object.assign({}, prevState.formErrors,fieldValidationErrors[fieldName] = hint)
    }), () => {this.validateForm()}
    )

  }

  validateForm = () => {

    let {valids} = this.state;

    for (var key in valids) {
      if (valids.hasOwnProperty(key)) {
        if(!valids[key]){
          valids.formValid = false;
          break;
        } else {
          valids.formValid = true
        }
      }
    }
    this.setState({ valids });
  }

  errorClass(error) {
    return(error.length === 0 ? null : 'error');
  }

  addContact = (e) => {
    e.preventDefault();

    let state = this.state;

    let contact = {
      email: state.email,
      telephone: state.telephone,
      name: state.name,
      surname: state.surname,
      index: state.contact.index
    }

    this.resetValids();
    if(this.state.contact.email){
        this.props.updateContact(contact);
    } else{
        this.props.addContact(contact);
    }
  }

  render() {

    return (
       <div className="modal-container">

         <FormGroup
            validationState={this.errorClass(this.state.formErrors.name)} >
            <ControlLabel>Name</ControlLabel>
            <FormControl
              type="text"
              name="name"
              value={this.state.name}
              placeholder="Name"
              onChange={this.handleUserInput} />
            <FormControl.Feedback />
            <HelpBlock> {this.state.formErrors.name} </HelpBlock>
        </FormGroup>

        <FormGroup
           validationState={this.errorClass(this.state.formErrors.surname)} >
           <ControlLabel>Surname</ControlLabel>
           <FormControl
             type="text"
             name="surname"
             value={this.state.surname}
             placeholder="Surname"
             onChange={this.handleUserInput} />
           <FormControl.Feedback />
           <HelpBlock> {this.state.formErrors.surname} </HelpBlock>
       </FormGroup>

         <FormGroup
            validationState={this.errorClass(this.state.formErrors.email)} >
            <ControlLabel>Email</ControlLabel>
            <FormControl
              type="email"
              name="email"
              value={this.state.email}
              placeholder="Contact email"
              onChange={this.handleUserInput} />
            <FormControl.Feedback />
            <HelpBlock> {this.state.formErrors.email} </HelpBlock>
        </FormGroup>

        <FormGroup
           validationState={this.errorClass(this.state.formErrors.telephone)} >
           <ControlLabel>Phone</ControlLabel>
           <FormControl
             type="tel"
             name="telephone"
             value={this.state.telephone}
             placeholder="Telephone"
             onChange={this.handleUserInput} />
           <FormControl.Feedback />
           <HelpBlock> {this.state.formErrors.telephone} </HelpBlock>
       </FormGroup>

           <Button type="submit" onClick={this.addContact}
              disabled={!this.state.valids.formValid}>
                {this.state.contact.email ? "Update Contact" : "Add Contact" }
            </Button>
           <Button type="submit" onClick={ () => this.resetValids() }  >Dissmiss</Button>
       </div>
     )
  }
}
