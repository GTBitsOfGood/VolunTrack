import React, { useState } from "react";
import { useRouter, withRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
import Icon from "./Icon";
// import { GoogleLogout } from 'react-google-login';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
} from "reactstrap";

// todo: put this somewhere that makes sense
import { capitalizeFirstLetter } from "../screens/Profile/helpers";

const pageSwitchWidth = (currPath) => {
  switch (currPath) {
    case "/applicant-viewer":
      return "9.6rem";
    case "/user-manager":
      return "8.6rem";
    case "/settings":
      return "8.6rem";
    case "/events":
      return "4.8rem";
    default:
      return "0";
  }
};

const pageSwitchLeft = (currPath) => {
  switch (currPath) {
    case "/applicant-viewer":
      return "-1rem";
    case "/user-manager":
      return "8.3rem";
    case "/settings":
      return "8.3rem";
    case "/events":
      return "16.9rem";
    default:
      return "0";
  }
};

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
    width: fit-content;
    margin-right: 1rem;
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
      content: "";
      width: ${(props) => pageSwitchWidth(props.currPathName)};
      height: 2.2rem;
      position: absolute;
      border-radius: 0.5rem;
      left: ${(props) => pageSwitchLeft(props.currPathName)};
      background: white;
      z-index: 0;
      transition: all 0.3s;
    }
  `,
  PageLink: styled.div`
    color: #969696;
    margin-left: 0.5rem;
    margin-right: 2rem;
    text-decoration: none;
    :hover {
      color: #607177;
    }
  `,
  DropdownLink: styled(Link)`
    color: black;
    :hover {
      color: black;
      text-decoration: none;
    }
  `,
  DropdownLinkProfile: styled.div`
    color: "#212529", 
    textDecoration: "none", 
    padding-left: "2rem",
    :hover {
      color: #607177;
    }
  `,
  UserContainer: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    width: 200px;
  `,
  UserIcon: styled.img`
    border-radius: 50%;
    width: 34px;
    height: 34px;
  `,
  ImgContainer: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 0px;
    padding-left: 10px;
  `,
  TxtContainer: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-wrap: wrap;
    ${(props) =>
      `
      color: ${props.theme.primaryGrey};
      font-size: 16px;
      white-space: nowrap;
    `}
  `,
  FlexContainer: styled.ul`
    width: 100%;
    display: flex;
    justify-content: space-between;
    list-style: none;
    padding-left: 80px;
  `,
};

const Header = ({ onLogout, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter;

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const currPageMatches = (page) => router.pathname === page;

  // DELETE AFTER AUTHENTICATION
  user.role = "admin";

  return (
    <Styled.Navbar light expand="md">
      <Container
        style={{
          marginLeft: "0px",
          marginRight: "0px",
          maxWidth: "100%",
          display: "flex",
        }}
      >
        <NavbarBrand tag={(props) => <Link {...props} />} href="/events">
          <div style={{ width: "175px", marginLeft: "1rem"}}>
            <Image
              layout="responsive"
              objectFit="contain"
              width="175px"
              height="100%"
              alt="bog logo"
              src="/images/bog_logo.png"
            />
          </div>
        </NavbarBrand>

        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Styled.FlexContainer className="navbar-nav">
            <Styled.PageSwitch currPathName={router.pathname}>
              {user.role === "admin" && (
              <Link
                  href="/applicant-viewer"
                  selected={currPageMatches("/applicant-viewer")}
                >
                <Styled.PageLink>Applicant Viewer</Styled.PageLink>
              </Link>
              )}
              {user.role === "admin" && (
              <Link
                  href="/user-manager"
                  selected={currPageMatches("/user-manager")}
              >
                <Styled.PageLink>User Manager</Styled.PageLink>
              </Link>
              )}
              <Link
                href="/events"
                selected={currPageMatches("/events")}
              >
                <Styled.PageLink>Events</Styled.PageLink>
              </Link>
              {user.role === "admin" && (
              <Link
                href="/settings"
                selected={currPageMatches("/settings")}
              >
                <Styled.PageLink>Settings</Styled.PageLink>
              </Link>
              )}
            </Styled.PageSwitch>
            <Styled.Dropdown nav inNavbar className="navbar-nav">
              <Styled.Toggle color="white">
                <Styled.UserContainer>
                  <Styled.UserContainer style={{ marginLeft: "-3rem" }}>
                    <Styled.ImgContainer style={{ paddingLeft: "0px" }}>
                      <Styled.UserIcon style={{ marginRight: "20px" }}
                        src="/images/test.jpg"
                        alt="icon"
                      ></Styled.UserIcon>
                    </Styled.ImgContainer>
                    <Styled.TxtContainer>
                      <p
                        style={{ margin: "0px" }}
                      >{`${user.bio?.first_name} ${user.bio?.last_name}`}</p>
                      <p style={{ margin: "0px" }}>{`${capitalizeFirstLetter(
                        user.role ?? ""
                      )}`}</p>
                    </Styled.TxtContainer>
                    <Styled.ImgContainer style={{ paddingRight: "0px" }}>
                      <Icon name="dropdown-arrow" size="1.5rem" />
                    </Styled.ImgContainer>
                  </Styled.UserContainer>
                </Styled.UserContainer>
              </Styled.Toggle>
              <DropdownMenu style={{ width: "100%" }}>
                <DropdownItem
                  tag={(props) => <Link {...props} />}
                  href="/profile"
                >
                <Styled.DropdownLinkProfile>Profile</Styled.DropdownLinkProfile>
                </DropdownItem>
                <DropdownItem onClick={onLogout} href="/">
                  {" "}
                  Logout{" "}
                </DropdownItem>
                
              </DropdownMenu>
            </Styled.Dropdown>
          </Styled.FlexContainer>
          <Nav navbar></Nav>
        </Collapse>
      </Container>
    </Styled.Navbar>
  );
};

export default withRouter(Header);
