import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import VolunteersTable from "../screens/Volunteers/VolunteersTable";
import { getUsers } from "../queries/users";

const VolunteersPage = () => {
  const {
    data: { user },
  } = useSession();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getUsers(user.organizationId, "volunteer");
        if (res && res.data && res.data.users) setUsers(res.data.users);
      } catch (e) {
        // ignore fetch errors for now
      } finally {
        setLoading(false);
      }
    };
    if (user && user.organizationId) fetch();
  }, [user]);

  return (
    <div className="relative left-[10%] flex h-full w-full flex-col pt-[1rem]">
      <div className="w-[80%]">
        <VolunteersTable sessionUser={user} users={users} loading={loading} />
      </div>
    </div>
  );
};

export default VolunteersPage;
