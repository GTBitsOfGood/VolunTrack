import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserDocument } from "../../../server/mongodb/models/User";
import EditUserForm from "../../components/Forms/EditUserForm";
import { RequestContext } from "../../providers/RequestProvider";
import { updateUser } from "../../queries/users";
import { UserInputClient } from "../../../server/mongodb/models/User/validators";

const Profile = () => {
  const { data: session } = useSession();
  if (!session) return "unauthenticated";
  const user = session.user;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const context = useContext(RequestContext);
  const router = useRouter();

  const [profileValues, setProfileValues] =
    useState<Partial<UserDocument>>(user);

  const handleSubmit = async (values: Partial<UserInputClient>) => {
    await updateUser(user._id, values);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    context.startLoading();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    context.success("Profile successfully updated!");
    router.reload();
  };

  return (
    <div className="flex w-full justify-center pt-4">
      <div className="w-3/4 rounded-md bg-white p-3 md:w-1/2">
        <p className="text-2xl font-semibold text-primaryColor">{`${user.firstName} ${user.lastName}`}</p>
        <p className="mb-2 capitalize">{user.role}</p>
        <EditUserForm
          userSelectedForEdit={profileValues}
          isAdmin={user.role === "admin"}
          isPopUp={false}
          submitHandler={handleSubmit}
          disableEdit={false}
        />
      </div>
    </div>
  );
};

export default Profile;
