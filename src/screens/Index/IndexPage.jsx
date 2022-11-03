import { useSession } from "next-auth/react";
import router from "next/router";
import "normalize.css";
import React, { useEffect } from "react";
import {
  updateApplicantRole,
  getInvitedAdmins,
  removeInvitedAdmin,
} from "../../actions/queries";

const IndexPage = () => {
  const {
    data: { user },
  } = useSession();

  const onRefresh = () => {
    getInvitedAdmins().then((result) => {
      if (result && result.data) {
        if (result.data.includes(user.bio.email)) {
          console.log("blah");
          updateApplicantRole(user.bio.email, "admin").then(() => {
            removeInvitedAdmin(user.bio.email).then(() => {
              window.location.reload();
            });
          });
        }
      }
    });
  };

  useEffect(() => {
    onRefresh();
    if (user.role === "admin") router.push("/events");
    if (user.role === "volunteer") router.push("/home");
  });

  return (
    <>
      <h1>
        Welcome {user.bio.first_name} {user.bio.last_name}
      </h1>
      <h2>Role: {user.role}</h2>
    </>
  );
};

export default IndexPage;
