import React from 'react';
import { FormGroup, ControlLabel, FormControl,  HelpBlock, Button } from 'react-bootstrap';
import './ContactForm.css';
import ops from 'immutable-ops';

const initialState = {
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
}

export class ContactForm extends React.Component {

  constructor(props) {
    super();
    this.state = {...initialState};
  }

  resetForm() {
       this.setState({...initialState});
    }

  //Assign edited contact values
  componentWillReceiveProps(nextProps) {
    if(nextProps.contactEdit !== null){

      const {contactEdit} = nextProps;

      this.setState({contact: contactEdit})

      //Remove currently edited contact from ContactList state
      nextProps.removeEditContact()

      if(contactEdit.toRemoved){
        this.resetForm();
      } else {
        this.setContactEdit(contactEdit,true);
      }

    }
  }

  //Sets form fields to either show edited contact
  // or clean them fields
  setContactEdit = (contactEdit, value) => {

    let valids = {...this.state.valids};

    //Edited contact need to have those set to true to able edit btn
    for (let keyValid in valids) {
      if (valids.hasOwnProperty(keyValid)) {
        valids[keyValid] = value;
      }
    }

    this.setState((prevState) => (
      {...contactEdit, valids }
      )
    )
  }

  handleUserInput = (e) => {
    const {name, type} = e.target,
    value = e.target.value.trim();

    this.setState({
      [name]: value}, () => { this.validateField(name, value, type) }
    );
  }

  validateField(fieldName, value, type) {

    let {formErrors,valids} = {...this.state},
    isValid, hint;

    switch(type) {

      case 'text':
        isValid = value.length > 2;
        hint = isValid ? '' : 'Input must be at least 3 characters long';
        break

      case 'email':
        isValid = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(value);
        hint = isValid ? '' : 'Provide legitimate email';
        break;

      case 'tel':
        isValid = /^\d{7,11}$/.test(value);
        hint = isValid ? '': ' Must be at least 7 numbers long to 11 numbers most';
        break;

      default:
        break;
    }

    //Keep js objects immutable with https://github.com/tommikaikkonen/immutable-ops
    valids = ops.setIn([fieldName + 'Valid'], isValid, valids);
    formErrors = ops.setIn([fieldName], hint, formErrors);

    this.setState((prevState) => ({
      valids , formErrors
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

    this.resetForm();

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
           <Button type="submit" onClick={ () => this.resetForm() }  >Dissmiss</Button>
       </div>
     )
  }
}
