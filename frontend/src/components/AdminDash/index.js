import React from 'react';
import styled from 'styled-components';
import { Route, Redirect } from 'react-router-dom';
import ApplicantViewer from './ApplicantViewer';
import UserManager from './UserManager';

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
      </Container>
    );
  }
}
export default AdminDash;
