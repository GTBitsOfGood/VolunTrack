import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Row, Col } from "reactstrap";
import { fetchEventsById } from "../../../actions/queries";
import variables from "../../../design-tokens/_variables.module.scss";
import { updateEvent } from "../../../screens/Events/User/eventHelpers";
import toast, { Toaster } from "react-hot-toast";
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
