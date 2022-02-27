import React from "react";
import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import Icon from "../../../components/Icon";
import styled from "styled-components";
import { Button } from "reactstrap";
import variables from "../../../design-tokens/_variables.module.scss";

const EventInfo = (event) => {
    return(
        <>
            <div>
                <Styled.EventName>{event.title}</Styled.EventName> 
                <Styled.Volunteers>{event.volunteers.length}/{event.max_volunteers}</Styled.Volunteers>
                <Styled.Description>{event.description}</Styled.Description>
                {/* age requirement*/}
                {/* dress code */}
                {/* important notes */}
            </div>
            <div>
                <Styled.Title>Event Information</Styled.Title>
                
            </div>
        </>
    )};

export default EventInfo;