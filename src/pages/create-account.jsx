import AuthPage from "../screens/Auth";
import { getSession } from "next-auth/react";

export default AuthPage;

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (session) {
    return { redirect: { destination: "/home", permanent: false } };
  }
  return { props: {} };
}
