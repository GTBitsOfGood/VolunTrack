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
    </>
  );
};

export default IndexPage;
