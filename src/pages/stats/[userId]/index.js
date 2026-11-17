import { useRouter } from "next/router";
import StatDisplay from "../../../screens/Stats/User/StatDisplay";

const UserStats = () => {
  const router = useRouter();

  // The member's id comes from the web address, which is still empty on the
  // first render of a refresh or a new tab. Wait for it, so the page never
  // shows the signed-in admin's own stats in the member's place.
  if (!router.isReady) return null;

  const { userId } = router.query;

  return (
    <>
      <StatDisplay userId={userId} />
    </>
  );
};

export default UserStats;
