import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
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
  Container
} from 'reactstrap';

import logo from '../images/drawchange_logo_white.png';

const pageSwitchWidth = currPath => {
  switch (currPath) {
    case '/applicant-viewer':
      return '9.6rem';
    case '/user-manager':
      return '8.6rem';
    case '/events':
      return '4.8rem';
    default:
      return '0';
  }
};

const pageSwitchLeft = currPath => {
  switch (currPath) {
    case '/applicant-viewer':
      return '-1rem';
    case '/user-manager':
      return '8.3rem';
    case '/events':
      return '16.9rem';
    default:
      return '0';
  }
};

const Styled = {
  NavItem: styled(NavItem)`
    margin-left: 0.3rem;
    margin-right: 0.3rem;
    text-align: center;
    min-width: 7rem;
  `,
  Dropdown: styled(UncontrolledDropdown)`
    margin-left: 0.3rem;
    margin-right: 0.3rem;
    text-align: center;
    min-width: 7rem;
  `,
  NavLabel: styled.p`
    color: white;
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
      width: ${props => pageSwitchWidth(props.currPathName)};
      height: 2.2rem;
      position: absolute;
      border-radius: 0.5rem;
      left: ${props => pageSwitchLeft(props.currPathName)};
      background: white;
      z-index: 0;
      transition: all 0.3s;
    }
  `,
  PageLink: styled(Link)`
    margin-right: 2rem;
    z-index: 1;

    :hover {
      color: white;
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
      color: white;
    `}
  `,
  FlexContainer: styled.ul`
    width: 100%;
    display: flex;
    justify-content: space-between;
    list-style: none;
    margin: 0;
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

  currPageMatches = page => this.props.location.pathname === page;

  render() {
    const { onLogout, loggedIn, location } = this.props;
    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <Container>
            <NavbarBrand tag={Link} to="/">
              <img style={{ width: '175px' }} alt="drawchange logo" src={logo} />
            </NavbarBrand>

            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              {loggedIn ? (
                <Styled.FlexContainer className="navbar-nav">
                  <Styled.PageSwitch currPathName={location.pathname}>
                    <Styled.PageLink
                      to="/applicant-viewer"
                      selected={this.currPageMatches('/applicant-viewer')}
                    >
                      Applicant Viewer
                    </Styled.PageLink>
                    <Styled.PageLink
                      to="/user-manager"
                      selected={this.currPageMatches('/user-manager')}
                    >
                      User Manager
                    </Styled.PageLink>
                    <Styled.PageLink to="/events" selected={this.currPageMatches('/events')}>
                      Events
                    </Styled.PageLink>
                  </Styled.PageSwitch>
                  <Styled.NavItem>
                    <NavLink onClick={onLogout} href="/">
                      Logout
                    </NavLink>
                  </Styled.NavItem>
                </Styled.FlexContainer>
              ) : (
                <Nav navbar></Nav>
              )}
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default withRouter(Header);
