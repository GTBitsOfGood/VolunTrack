import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button } from "reactstrap";
import Icon from "../../components/Icon";
import { getCurrentUser } from "../../actions/queries";
import SettingsEditModal from "./SettingsEditModal";
import SettingsTable from "./SettingsTable";

const Styled = {
  Container: styled.div`
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.grey9};
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  HeaderContainer: styled.div`
    width: 95%;
    max-width: 80rem;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
  `,
  Button: styled(Button)`
    background: white;
    border: none;
    &:hover {
      background: gainsboro;
    }
    &:focus {
      background: white;
      box-shadow: none;
    }
  `,
  Files: styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
  `,
};

const SettingsManager = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);

  const onRefresh = () => {
    setLoading(true);
    getCurrentUser()
      .then((result) => {
        if (result) {
          setUserData(result.data.users[0]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onCreateClicked = () => {
    setShowEditModal(true);
  };

  const toggleEditModal = () => {
    setShowEditModal((prev) => !prev);
    onRefresh();
  };
  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <Styled.Container>
      <Styled.HeaderContainer>
        <Styled.Button onClick={onCreateClicked}>
          <Icon color="grey3" name="add" />
          <span style={{ color: "black" }}>Edit</span>
        </Styled.Button>
      </Styled.HeaderContainer>
      <SettingsTable user={userData} loading={loading}>
        {" "}
      </SettingsTable>
      <SettingsEditModal open={showEditModal} toggle={toggleEditModal} />
      <Styled.Files>
        Adult
        <form action="/api/waivers" enctype="multipart/form-data" method="POST">
          <input type="file" class="admin__input" id="adult" name="adult" />
          <input class="admin__submit" type="submit" />
        </form>
        Minor
        <form action="/api/waivers" enctype="multipart/form-data" method="POST">
          <input type="file" class="admin__input" id="minor" name="minor" />
          <input class="admin__submit" type="submit" />
        </form>
      </Styled.Files>
      
    </Styled.Container>
  );
};

export default SettingsManager;
