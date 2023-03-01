import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, withRouter } from "next/router";
import "flowbite-react";
import React from "react";
import { capitalizeFirstLetter } from "../screens/Profile/helpers";
import { Navbar, Dropdown, Avatar } from "flowbite-react";

const Header = () => {
  const router = useRouter();
  const {
    data: { user },
  } = useSession();

  const logout = () => {
    signOut();
  };

  const goToProfile = () => {
    router.push("/profile");
  };

  const goToHistory = () => {
    router.push("/history");
  };

  const gotToSummary = () => {
    router.push("/events-summary");
  };

  const goToStats = () => {
    router.push("/stats");
  };

  const goToManageAdmins = () => {
    router.push("/assistants");
  };

  const goToManageWaivers = () => {
    router.push("/manage-waivers");
  };

  const currPageMatches = (page) => router.pathname === page;

  const dropdownItems = (
    <React.Fragment>
      <Dropdown.Item onClick={goToProfile} href="/profile">
        Profile
      </Dropdown.Item>
      {user.role === "admin" && (
        <div>
          <Dropdown.Item onClick={goToHistory} href="/history">
            Change History
          </Dropdown.Item>
          <Dropdown.Item onClick={gotToSummary} href="/events-summary">
            Event Summary
          </Dropdown.Item>
        </div>
      )}
      <Dropdown.Divider />
      <Dropdown.Item onClick={logout} href="/">
        Sign Out
      </Dropdown.Item>
    </React.Fragment>
  );

  return (
    <Navbar fluid={false} rounded={true}>
      <Navbar.Brand tag={(props) => <Link {...props} />} href="/home">
        <img
          src="/images/helping_mamas_logo.png"
          alt="helping mamas logo"
          className="h-10"
        />
      </Navbar.Brand>
      <Navbar.Toggle />
      {/*<div className="w-48 sm:w-0 md:w-0" />*/}
      <Navbar.Collapse>
        <Navbar.Link
          href="/home"
          className={`text-lg font-bold ${
            currPageMatches("/home") ? "text-pink-800" : "text-gray-600"
          }`}
        >
          Home
        </Navbar.Link>
        {user.role === "admin" && (
          <Navbar.Link
            href="/volunteers"
            className={`text-lg font-bold ${
              currPageMatches("/volunteers") ? "text-pink-800" : "text-gray-600"
            }`}
          >
            Volunteers
          </Navbar.Link>
        )}
        <Navbar.Link
          href="/events"
          className={`text-lg font-bold ${
            currPageMatches("/events") ? "text-pink-800" : "text-gray-600"
          }`}
        >
          Events
        </Navbar.Link>
        {user.role === "volunteer" && (
          <Navbar.Link
            onClick={goToStats}
            href="/stats"
            className={`text-lg font-bold ${
              currPageMatches("/stats") ? "text-pink-800" : "text-gray-600"
            }`}
          >
            Participation History
          </Navbar.Link>
        )}
        <Navbar.Link>
          {user.role === "admin" && (
            <Dropdown
              arrowIcon={true}
              inline={true}
              label={
                <div
                  className={`text-lg font-bold ${
                    currPageMatches("/assistants") ||
                    currPageMatches("/manage-waivers")
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  Settings
                </div>
              }
            >
              <Dropdown.Item onClick={goToManageAdmins} href="/assistants">
                Manage Admins
              </Dropdown.Item>
              <Dropdown.Item onClick={goToManageWaivers} href="/manage-waivers">
                Manage Waivers
              </Dropdown.Item>
            </Dropdown>
          )}
        </Navbar.Link>
        <div className="mr-2 flex hidden md:order-2 md:block">
          <Dropdown
            arrowIcon={true}
            inline={true}
            label={
              <div className="flex">
                <Avatar
                  img={user.imageUrl ?? "/images/gradient-avatar.png"}
                  alt="icon"
                  rounded={true}
                />
                <div className="ml-3 flex flex-col gap-0 text-left">
                  <p className="mb-0">{`${user.bio?.first_name} ${user.bio?.last_name}`}</p>
                  <p className="mb-0">{`${capitalizeFirstLetter(
                    user.role ?? ""
                  )}`}</p>
                </div>
              </div>
            }
          >
            {dropdownItems}
          </Dropdown>
        </div>
        <Navbar.Link className="block md:hidden">
          <Dropdown
            arrowIcon={true}
            inline={true}
            label={
              <div
                className={`text-lg font-bold ${
                  currPageMatches("/assistants") ||
                  currPageMatches("/manage-waivers")
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                Profile Settings
              </div>
            }
          >
            {dropdownItems}
          </Dropdown>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default withRouter(Header);
