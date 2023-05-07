import { useSession } from "next-auth/react";
import router from "next/router";
import "normalize.css";
import { useEffect } from "react";

const IndexPage = () => {
  const {
    data: { user },
  } = useSession();

  useEffect(() => {
    router.push("/home");
  });

  return (
    <>
      <h1>
        Welcome {user.firstName} {user.lastName}
      </h1>
      <h2>Role: {user.role}</h2>
    </>
  );
};

export default IndexPage;
