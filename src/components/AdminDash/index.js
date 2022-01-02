import React from 'react';
import styled from 'styled-components';
import { Route, Redirect } from 'react-router-dom';
import ApplicantViewer from './ApplicantViewer';
import UserManager from './user/UserManager';
import EventManager from './events/EventManager';

const Container = styled.div`
  background: white;
  height: 100%;
  width: 100%;
`;

class AdminDash extends React.Component {
  state = {
    redirectToViewer: false
  };
  componentDidMount = () => {
    if (window.location.pathname === '/') {
      this.setState({ redirectToViewer: true });
    }
  };
  renderRedirect() {
    if (this.state.redirectToViewer) {
      return <Redirect to="/applicant-viewer" />;
    }
  }
  render() {
    return (
      <Container>
        {this.renderRedirect()}
        <Route path="/applicant-viewer" component={ApplicantViewer} />
        <Route path="/user-manager" component={UserManager} />
        <Route path="/events" component={EventManager} />
      </Container>
    );
  }
}
export default AdminDash;
