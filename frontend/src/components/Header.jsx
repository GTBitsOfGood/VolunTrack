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
  Container
} from 'reactstrap';

import logo from '../images/drawchange_logo_white.png';

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
      width: ${props => (props.currPathName === '/applicant-viewer' ? '10rem' : '9rem')};
      height: 2.2rem;
      position: absolute;
      border-radius: 0.5rem;
      left: ${props => (props.currPathName === '/applicant-viewer' ? '-1rem' : '8.5rem')};
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

  currPageMatches = page => window.location.pathname === page;

  render() {
    const { onLogout, loggedIn, role } = this.props;
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
                  </Styled.PageSwitch>
                  <Styled.NavItem>
                    <NavLink href="http://www.drawchange.org">Back to Main Site</NavLink>
                  </Styled.NavItem>
                  <Styled.NavItem>
                    <NavLink onClick={onLogout} href="/">
                      Logout
                    </NavLink>
                  </Styled.NavItem>
                </Styled.FlexContainer>
              ) : (
                <Nav navbar>
                  <Styled.NavItem>
                    <NavLink href="http://www.drawchange.org">Home</NavLink>
                  </Styled.NavItem>
                  <Styled.Dropdown nav inNavbar>
                    <DropdownToggle nav>About Us</DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem href="http://www.drawchange.org/faqs">FAQs</DropdownItem>
                      <DropdownItem href="http://www.drawchange.org/foundersstory">
                        Founder's Story
                      </DropdownItem>
                      <DropdownItem href="http://www.drawchange.org/curriculum-blueprint">
                        Curriculum & Blueprint
                      </DropdownItem>
                      <DropdownItem href="http://www.drawchange.org/friends-partners">
                        Our Friends & Partners
                      </DropdownItem>
                      <DropdownItem href="http://www.drawchange.org/store">Store</DropdownItem>
                      <DropdownItem href="http://www.drawchange.org/press-kit">
                        Press Kit
                      </DropdownItem>
                    </DropdownMenu>
                  </Styled.Dropdown>
                  <Styled.Dropdown nav inNavbar>
                    <DropdownToggle nav>Contribute</DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem href="https://secure.donationpay.org/drawchange/">
                        Donate
                      </DropdownItem>
                      <DropdownItem href="/">Volunteer With Us</DropdownItem>
                      <DropdownItem href="http://www.drawchange.org/wishlist">
                        Wish List
                      </DropdownItem>
                    </DropdownMenu>
                  </Styled.Dropdown>
                  <Styled.Dropdown>
                    <NavLink href="http://www.drawchange.org/blog">News</NavLink>
                  </Styled.Dropdown>
                  <Styled.Dropdown nav inNavbar>
                    <DropdownToggle nav>Activities</DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem href="https://www.drawchange.org/usprograms">
                        U.S. Programs
                      </DropdownItem>
                      <DropdownItem href="https://www.drawchange.org/costarica">
                        Costa Rica
                      </DropdownItem>
                      <DropdownItem href="https://www.drawchange.org/ethiopia">
                        Ethipoia
                      </DropdownItem>
                    </DropdownMenu>
                  </Styled.Dropdown>
                  <Styled.NavItem>
                    <NavLink href="http://www.drawchange.org/contactus">Contact</NavLink>
                  </Styled.NavItem>
                  <Styled.Dropdown>
                    <NavLink href="https://secure.donationpay.org/drawchange/">Donate</NavLink>
                  </Styled.Dropdown>
                </Nav>
              )}
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default Header;
