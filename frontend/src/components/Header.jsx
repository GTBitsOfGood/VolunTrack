import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
// import { GoogleLogout } from 'react-google-login';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container, 
  Button, 
  Card, 
  CardImg,
  CardTitle,
  CardText,
  CardGroup,
  CardBody,
  Row,
  Col
} from 'reactstrap';

import logo from '../images/bog_logo.png';
import avatar from '../images/default_avatar.png';

const Styled = {
  Navbar: styled(Navbar)`
    background-color: #ffffff;
    min-height: 6rem;
  `,
  NavItem: styled(NavItem)`
    margin-left: 0.3rem;
    margin-right: 0.3rem;
    text-align: center;
    min-width: 7rem;
  `,
  Dropdown: styled(UncontrolledDropdown)`
    text-align: center;
    min-width: 7rem;
  `,
  Toggle: styled(DropdownToggle)`
    text-align: left;
  `,
  NavLabel: styled.p`
    color: #969696;
    margin: auto;
    margin-left: 2rem;
    flex: 1;
    font-weight: 600;
    font-size: 1.3rem;
  `,
  PageSwitch: styled.div`
    display: flex;
    position: relative;
    align-items: center;
    margin-left: 2rem;
    margin-right: auto;

    :before {
      content: '';
      width: ${props => (props.currPathName === '/applicant-viewer' ? '10rem' : '9rem')};
      height: 2.2rem;
      position: absolute;
      border-radius: 0.5rem;
      left: ${props => (props.currPathName === '/applicant-viewer' ? '-1rem' : '8.5rem')};
      z-index: 0;
      transition: all 0.3s;
    }
  `,
  PageLink: styled(Link)`
    margin-right: 2rem;
    z-index: 1;

    :hover {
      color: #707070;
      text-decoration: none;
    }
    ${props =>
      props.selected
        ? `
      color: ${props.theme.primaryGrey};
      font-weight: 600;

      :hover {
        color: ${props.theme.primaryGrey};
      }
    `
        : `
      color: #969696;
    `}
  `,
  FlexContainer: styled.ul`
    width: 100%;
    display: flex;
    justify-content: space-between;
    list-style: none;
    padding-left: 150px;
  `
};

class Header extends Component {
  state = {
    isOpen: false
  };

  toggle = _ => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  componentDidMount = () => {
    console.log(window.location.pathname);
  };

  currPageMatches = page => window.location.pathname === page;

  render() {
    const { onLogout, loggedIn, role } = this.props;
    return (
      <div>
        <Styled.Navbar light expand="md">
          <Container style={{marginLeft: '0px'}}>
            <NavbarBrand tag={Link} to="/applicant-viewer">
              <img style={{ width: '175px' }} alt="bog logo" src={logo} />
            </NavbarBrand>

            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              {loggedIn ? (
                <Styled.FlexContainer className="navbar-nav">
                  <Styled.PageSwitch currPathName={window.location.pathname}>
                    <Styled.PageLink
                      to="/applicant-viewer"
                      selected={this.currPageMatches('/applicant-viewer')}
                    >
                      Applicant Viewer
                    </Styled.PageLink>
                    {role === 'admin' && (
                      <Styled.PageLink
                        to="/user-manager"
                        selected={this.currPageMatches('/user-manager')}
                      >
                        User Manager
                      </Styled.PageLink>
                    )}
                    <Styled.PageLink
                      to="/events"
                      selected={this.currPageMatches('/events')}
                    > 
                      Events
                    </Styled.PageLink>
                    <Styled.PageLink
                      to="/settings"
                      selected={this.currPageMatches('/settings')}
                    > 
                      Settings
                    </Styled.PageLink>
                  </Styled.PageSwitch>
                  <Styled.Dropdown nav inNavbar>
                    <Styled.Toggle color="white">
                      {/* <CardGroup style={{}}>
                        <Card body className="text-center" style={{padding: '0rem', border: 'none'}}>
                          <img width="25" height="25" src={avatar}/>
                        </Card>
                        <Card body className="text-center" style={{padding: '0rem', border: 'none'}}>
                          <CardText style={{fontSize: '0.8rem'}}>Firstname Lastname</CardText>
                            <CardText style={{fontSize: '0.8rem'}}>Role</CardText>
                        </Card>
                      </CardGroup> */}
                      <Row>
                        <Col md="auto" style={{}}>
                          <Card body className="text-center" style={{padding: '0rem', border: 'none'}}>
                            <img width="50" height="50" src={avatar}/>
                          </Card>
                        </Col>
                        <Col md="auto" style={{padding: '0px'}}>
                          <Card body className="text-left" style={{padding: '0rem', border: 'none'}}>
                            <CardText style={{fontSize: '0.8rem', padding: '0.5px'}}>Firstname Lastname</CardText>
                            <CardText style={{fontSize: '0.8rem', padding: '0.5px'}}>Role</CardText>
                          </Card>
                        </Col>
                      </Row>
                    </Styled.Toggle>
                    <DropdownMenu>
                      <DropdownItem>My Profile</DropdownItem>
                      <DropdownItem onClick={onLogout} href="/"> Logout </DropdownItem>
                    </DropdownMenu>
                  </Styled.Dropdown>
                </Styled.FlexContainer>
              ) : (
                <Nav navbar>
                </Nav>
              )}
            </Collapse>
          </Container>
        </Styled.Navbar>
      </div>
    );
  }
}

export default Header;
