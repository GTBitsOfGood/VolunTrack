import { useSession } from "next-auth/react";
import "normalize.css";
import React from "react";

const IndexPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <h1>
        Welcome {session.user.bio.first_name} {session.user.bio.last_name}
      </h1>
      <h2>Role: {session.user.role}</h2>
    </>
  );
};

export default IndexPage;
