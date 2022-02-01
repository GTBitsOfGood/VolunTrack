import { signIn, useSession, signOut } from "next-auth/react";
import React from "react";

const Test = () => {
  const { data: session } = useSession();

  return (
    <>
      {!session && (
        <a
          href={`/api/auth/signin`}
          onClick={(e) => {
            e.preventDefault();
            signIn("google", {
              callbackUrl: "http://localhost:3001/",
            });
          }}
        >
          Sign in
        </a>
      )}
      {session && (
        <>
          <p>you are signed in as {session.user.name}</p>
          <a
            href={`/api/auth/signout`}
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
          >
            Sign out
          </a>
        </>
      )}
    </>
  );
};

export default Test;
