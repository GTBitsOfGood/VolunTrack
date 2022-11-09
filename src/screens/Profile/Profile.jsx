import { useSession } from "next-auth/react";
import {useContext, useState} from "react";
import styled from "styled-components";
import ProfileForm from "./ProfileForm";
import { RequestContext } from "../../providers/RequestProvider";

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.grey9};
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: ;
  `,
  HeaderContainer: styled.div`
    width: 95%;
    max-width: 80rem;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  `,
};

const Profile = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState(session.user);

  return (
    <Styled.Container>
      <ProfileForm
        user={user}
        isAdmin={session.user.role === "admin"}
        editUserCallback={(user) => {
          setUser(user)
          console.log(user);
        }}
        context={useContext(RequestContext)}
      />
    </Styled.Container>
  );
};

export default Profile;
