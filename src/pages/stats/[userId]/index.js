import { useRouter } from "next/router";
import StatDisplay from "../../../screens/Stats/User/StatDisplay";

const UserStats = () => {
  const router = useRouter();
  const { userId } = router.query;

  return (
    <>
      <StatDisplay userId={userId} />
    </>
  );
};

export default UserStats;
