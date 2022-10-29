import { useRouter } from "next/router";
import EventManager from "../../../screens/Stats/User/EventManager";

const UserStats = () => {
  const router = useRouter();
  const { userId } = router.query;

  return (
    <>
      <EventManager userId={userId} />
    </>
  );
};

export default UserStats;
