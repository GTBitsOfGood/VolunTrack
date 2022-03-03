import React from "react";
import {useRouter} from 'next/router';
// import { useSession } from "next-auth/react";
// import PropTypes from "prop-types";
// import Icon from "../components/Icon";
// import styled from "styled-components";
// import { Button } from "reactstrap";
// import variables from "../../../design-tokens/_variables.module.scss";

const EventInfo = (event) => {
    const router = useRouter()
    const { eventId } = router.query

    console.log('hello');
    return (
        <>
            {/* <div>
                <Styled.EventName>Event Name</Styled.EventName> 
                <Styled.Volunteers>Date Created</Styled.Volunteers>
                <Styled.Description>Description</Styled.Description>
                <Styled.AgeReq>Age Requirement</Styled.AgeReq>
                <Styled.Dress>Dress Code</Styled.Dress>
                <Styled.Notes>important notes</Styled.Notes>
            </div>
            <div>
                <Styled.Title>Event Information</Styled.Title>
                
            </div> */}
            <p>Event Id: {eventId}</p>
        </>
    )};

export default EventInfo;