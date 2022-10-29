import { ErrorMessage, Form as FForm } from "formik";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import ProfileTable from "./ProfileTable";
import { RequestContext } from "../../providers/RequestProvider";
import { useContext } from "react";

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
  Form: styled(FForm)`
    width: 50%;
    background: white;
    padding: 5%;
  `,
  ErrorMessage: styled(ErrorMessage).attrs({
    component: "span",
  })`
    ::before {
      content: "*";
    }
    color: red;
    font-size: 14px;
    font-weight: bold;
    display: inline-block;
  `,
};

const Profile = () => {
  const { data: session } = useSession();
  console.log(session.user);

  return (
    <Styled.Container>
      <ProfileTable
        user={session.user}
        isAdmin={false}
        editUserCallback={() => console.log("callback")}
        context={useContext(RequestContext)}
      />
    </Styled.Container>
  );
};

export default Profile;
