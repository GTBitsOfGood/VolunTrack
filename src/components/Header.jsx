import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, withRouter } from "next/router";
import React, { useState } from "react";
import {
  Collapse,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  UncontrolledDropdown,
} from "reactstrap";
import styled from "styled-components";
// todo: put this somewhere that makes sense
import { capitalizeFirstLetter } from "../screens/Profile/helpers";
import Icon from "./Icon";

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
  PageLink: styled(Link)`
    margin-left: 2rem;
    margin-right: 2rem;
    z-index: 1;

    :hover {
      color: #707070;
      text-decoration: none;
    }
    ${(props) =>
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
  DropdownLink: styled(Link)`
    color: black;
    :hover {
      color: black;
      text-decoration: none;
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

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const user = session.user;

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const logout = (e) => {
    e.preventDefault();
    signOut();
  };

  const goToProfile = (e) => {
    e.preventDefault();
    router.push("/profile");
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
          <div style={{ width: "175px" }}>
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
                <Styled.PageLink
                  href="/applicant-viewer"
                  selected={currPageMatches("/applicant-viewer")}
                >
                  Applicant Viewer
                </Styled.PageLink>
              )}
              {user.role === "admin" && (
                <Styled.PageLink
                  href="/user-manager"
                  selected={currPageMatches("/user-manager")}
                >
                  User Manager
                </Styled.PageLink>
              )}
              <Styled.PageLink
                href="/events"
                selected={currPageMatches("/events")}
              >
                Events
              </Styled.PageLink>
              {user.role === "admin" && (
                <Styled.PageLink
                  href="/settings"
                  selected={currPageMatches("/settings")}
                >
                  Settings
                </Styled.PageLink>
              )}
            </Styled.PageSwitch>
            <Styled.Dropdown nav inNavbar className="navbar-nav">
              <Styled.Toggle color="white">
                <Styled.UserContainer>
                  <Styled.UserContainer>
                    <Styled.ImgContainer style={{ paddingLeft: "0px" }}>
                      <Styled.UserIcon
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
                <DropdownItem onClick={goToProfile} href="/profile">
                  Profile
                </DropdownItem>
                <DropdownItem onClick={logout} href="/">
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
