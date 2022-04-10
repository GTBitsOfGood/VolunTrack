import { useSession } from "next-auth/react";
import router from "next/router";
import "normalize.css";
import React, { useEffect } from "react";

const IndexPage = () => {
  const {
    data: { user },
  } = useSession();

  useEffect(() => {
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
