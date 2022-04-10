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
import variables from "../design-tokens/_variables.module.scss";
import { capitalizeFirstLetter } from "../screens/Profile/helpers";
import Icon from "./Icon";

const pageSwitchWidth = (currPath) => {
  switch (currPath) {
    case "/applicant-viewer":
      return "9.6rem";
    case "/user-manager":
      return "8.6rem";
    case "/assistants":
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
    case "/assistants":
      return "8.6rem";
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
    height: 60px;
    font-size: larger;
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
    margin-right: 3rem;

    :before {
      content: "";
      height: 2.2rem;
      position: absolute;
      border-radius: 0.5rem;
      left: ${(props) => pageSwitchLeft(props.currPathName)};
      background: transparent;
      z-index: 0;
      transition: all 0.3s;
    }
  `,
  PageLink: styled.div`
    color: ${variables["primary"]};
    font-size: 90%;
    font-weight: 550;
    margin-right: 2rem;
    text-decoration: none;
    :hover {
      cursor: pointer;
    }
  `,
  DropdownLink: styled(Link)`
    color: black;
    :hover {
      color: black;
      text-decoration: none;
    }
  `,
  DropdownItem: styled.div`
    color: #212529;
    padding-top: 0.2rem;
    padding-bottom: 0.2rem;
    :hover {
      cursor: pointer;
      background-color: #f2f2f2;
    }
  `,
  UserContainer: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
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
    margin-left: 2rem;
  `,
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const {
    data: { user },
  } = useSession();

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

  const goToManageAdmins = (e) => {
    e.preventDefault();
    router.push("/assistants");
  };

  const goToManageWaivers = (e) => {
    e.preventDefault();
    router.push("/manage-waivers");
  };

  const currPageMatches = (page) => router.pathname === page;

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
        <NavbarBrand tag={(props) => <Link {...props} />} href="/">
          <div style={{ width: "175px", cursor: "pointer" }}>
            <Image
              objectFit="contain"
              height="60px"
              width="300px"
              layout="fixed"
              alt="helping mamas logo"
              src="/images/helping_mamas_logo.png"
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
              {user.role === "volunteer" && (
                <Link href="/home" selected={currPageMatches("/home")}>
                  <Styled.PageLink>Home</Styled.PageLink>
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
              <Link href="/events" selected={currPageMatches("/events")}>
                <Styled.PageLink>Events</Styled.PageLink>
              </Link>
              <Link
                href="/past-events"
                selected={currPageMatches("/past-events")}
              >
                <Styled.PageLink>Past Events</Styled.PageLink>
              </Link>
              {user.role === "admin" && (
                <Styled.Dropdown nav inNavbar className="navbar-nav">
                  <Styled.Toggle color="white">
                    <Styled.UserContainer>
                      <Styled.TxtContainer>
                        <Link
                          href="/settings"
                          selected={currPageMatches("/settings")}
                        >
                          <Styled.PageLink style={{ "font-size": "100%" }}>
                            Settings
                          </Styled.PageLink>
                        </Link>
                      </Styled.TxtContainer>
                      <Styled.ImgContainer>
                        <Icon name="dropdown-arrow" size="1.5rem" />
                      </Styled.ImgContainer>
                    </Styled.UserContainer>
                  </Styled.Toggle>

                  <DropdownMenu
                    style={{
                      width: "100%",
                      marginTop: "0.6rem",
                      border: "none",
                    }}
                  >
                    <DropdownItem onClick={goToManageAdmins} href="/assistants">
                      <Styled.DropdownItem>Manage Admins</Styled.DropdownItem>
                    </DropdownItem>
                    <DropdownItem
                      onClick={goToManageWaivers}
                      href="/manage-waivers"
                    >
                      <Styled.DropdownItem>Manage Waivers</Styled.DropdownItem>
                    </DropdownItem>
                  </DropdownMenu>
                </Styled.Dropdown>
              )}
            </Styled.PageSwitch>
            <Styled.Dropdown nav inNavbar className="navbar-nav">
              <Styled.Toggle color="white">
                <Styled.UserContainer>
                  <Styled.UserContainer style={{ marginLeft: "-3rem" }}>
                    <Styled.ImgContainer style={{ paddingLeft: "0px" }}>
                      <Styled.UserIcon
                        style={{ marginRight: "20px" }}
                        src={user.imageUrl ?? "/images/test.jpg"}
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
                  <Styled.DropdownItem>Profile</Styled.DropdownItem>
                </DropdownItem>
                <DropdownItem onClick={logout} href="/">
                  <Styled.DropdownItem>Logout</Styled.DropdownItem>
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
