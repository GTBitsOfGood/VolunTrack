import { useSession } from "next-auth/react";
import StatDisplay from "./User/StatDisplay";

const Stats = () => {
  const {
    data: { user },
  } = useSession();

  return <StatDisplay userId={user._id} />;
};

export default Stats;
