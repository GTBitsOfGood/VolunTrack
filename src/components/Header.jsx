import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, withRouter } from "next/router";
import { useState } from "react";
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

const pageSwitchLeft = (currPath) => {
  switch (currPath) {
    case "/volunteers":
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
    @media (max-width: 768px) {
      height: 70px;
    }
  `,

  MobileBackground: styled.div`
    @media (max-width: 768px) {
      background-color: #ffffff;
      position: absolute;
      display: flex;
      z-index: 1000;
      padding: 10px;
      left: 0;
      right: 0;
      top: 70px
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
    @media (max-width: 768px) {
      margin-left: 0rem;
    }

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
    @media (max-width: 768px) {
      margin-right: 1rem;
    }
    text-decoration: none;
    :hover {
      color: ${variables["dark"]};
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
      // background-color: #f2f2f2;
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
    @media (max-width: 768px) {
      display: none;
    }
  `,
  ImgContainer: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 0px;
    padding-left: 10px;
    @media (max-width: 768px) {
      width: 48px;
    }\`
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
    @media (max-width: 768px) {
      margin-left: 0rem;
      padding-left: 0px;
    }
  `,
};

let SelectedPageLink = styled(Styled.PageLink)`
  color: ${variables["dark"]};
`;

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

  const goToHistory = (e) => {
    e.preventDefault();
    router.push("/history");
  };

  const goToStats = (e) => {
    e.preventDefault();
    router.push("/stats");
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
        }}
      >
        <NavbarBrand tag={(props) => <Link {...props} />} href="/home">
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
          <Styled.MobileBackground>
            <Styled.FlexContainer className="navbar-nav">
              <Styled.PageSwitch currPathName={router.pathname}>
                <Link href="/home">
                  {currPageMatches("/home") ? (
                    <SelectedPageLink>Home</SelectedPageLink>
                  ) : (
                    <Styled.PageLink>Home</Styled.PageLink>
                  )}
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/volunteers"
                    selected={currPageMatches("/volunteers")}
                  >
                    {currPageMatches("/volunteers") ? (
                      <SelectedPageLink>Volunteers</SelectedPageLink>
                    ) : (
                      <Styled.PageLink>Volunteers</Styled.PageLink>
                    )}
                  </Link>
                )}
                <Link href="/events" selected={currPageMatches("/events")}>
                  {currPageMatches("/events") ? (
                    <SelectedPageLink>Events</SelectedPageLink>
                  ) : (
                    <Styled.PageLink>Events</Styled.PageLink>
                  )}
                </Link>
                {user.role === "volunteer" && (
                  <Link onClick={goToStats} href="/stats">
                    {currPageMatches("/stats") ? (
                      <SelectedPageLink>Participation History</SelectedPageLink>
                    ) : (
                      <Styled.PageLink>Participation History</Styled.PageLink>
                    )}
                  </Link>
                )}
                {user.role === "admin" && (
                  <Styled.Dropdown nav inNavbar className="navbar-nav">
                    <Styled.Toggle color="white">
                      <Styled.UserContainer>
                        <Styled.TxtContainer>
                          {currPageMatches("/assistants") ||
                          currPageMatches("/manage-waivers") ? (
                            <SelectedPageLink style={{ "font-size": "108%" }}>
                              Settings
                            </SelectedPageLink>
                          ) : (
                            <Styled.PageLink style={{ "font-size": "108%" }}>
                              Settings
                            </Styled.PageLink>
                          )}
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
                      <DropdownItem
                        onClick={goToManageAdmins}
                        href="/assistants"
                      >
                        <Styled.DropdownItem>Manage Admins</Styled.DropdownItem>
                      </DropdownItem>
                      <DropdownItem
                        onClick={goToManageWaivers}
                        href="/manage-waivers"
                      >
                        <Styled.DropdownItem>
                          Manage Waivers
                        </Styled.DropdownItem>
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
                          src={user.imageUrl ?? "/images/gradient-avatar.png"}
                          alt="icon"
                        />
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
                  {user.role === "admin" && (
                    <DropdownItem onClick={goToHistory} href="/history">
                      <Styled.DropdownItem>History</Styled.DropdownItem>
                    </DropdownItem>
                  )}
                  <DropdownItem onClick={logout} href="/">
                    <Styled.DropdownItem>Sign Out</Styled.DropdownItem>
                  </DropdownItem>
                </DropdownMenu>
              </Styled.Dropdown>
            </Styled.FlexContainer>
            <Nav navbar></Nav>
          </Styled.MobileBackground>
        </Collapse>
      </Container>
    </Styled.Navbar>
  );
};

export default withRouter(Header);
