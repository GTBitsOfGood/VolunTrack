import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';

// Local Components
import Text from '../../components/inputs/Text';
import '../../assets/stylesheets/ItemDisplay.css';
class ContactUsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      didsend: false,
      isEmpty: false
    };
    // this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event) {
    console.log(event);
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  // handleSubmit(event) {
  //     // event.preventDefault();
  //     this.handleForm.bind(event);
  //     event.target.reset();
  // }
  handleForm(event) {
    event.preventDefault();
    if (
      !this.state.firstName ||
      !this.state.lastName ||
      !this.state.email ||
      !this.state.phoneNumber ||
      !this.state.subject ||
      !this.state.message
    ) {
      this.setState({ isEmpty: true });
      return;
    }
    fetch('/api/contact/', {
      method: 'POST',
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        phoneNumber: this.state.phoneNumber,
        subject: this.state.subject,
        message: this.state.message
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(json => {
        this.setState({ didsend: true });
        console.log(json);
      })
      .catch(() => {});
  }
  render() {
    return (
      <div>
        <Col md={7} mdOffset={2} style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}>
          {this.state.didsend ? (
            <p>Sent</p>
          ) : (
            <form onSubmit={this.handleForm.bind(this)}>
              <Text
                name="firstName"
                label="First Name"
                onChange={this.handleChange.bind(this)}
                placeholder="First Name"
              />
              <Text
                name="lastName"
                label="Last Name"
                onChange={this.handleChange.bind(this)}
                placeholder="Last Name"
              />
              <Text
                name="email"
                label="Email"
                onChange={this.handleChange.bind(this)}
                placeholder="example@gmail.com"
              />
              <Text
                name="phoneNumber"
                label="Phone Number"
                onChange={this.handleChange.bind(this)}
                placeholder="999-999-9999"
              />
              <Text
                name="subject"
                label="Subject"
                onChange={this.handleChange.bind(this)}
                placeholder="Subject"
              />
              <Text
                name="message"
                label="Message"
                onChange={this.handleChange.bind(this)}
                placeholder="Message"
              />
              <p className="submitbutton">
                <Button bsStyle="primary" type="submit">
                  Submit
                </Button>
              </p>
            </form>
          )}
          {this.state.isEmpty && <p>Please fill in all the information.</p>}
        </Col>
      </div>
    );
  }
}

export default ContactUsForm;
