import React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import { ModalFooter, Row, Col, Button, Container, FormGroup, UncontrolledTooltip, Input } from "reactstrap";
import EventRegisterInfoContainer from "./EventRegisterInfoContainer";
import IconSpecial from "../../../../components/IconSpecial";

import PropTypes from "prop-types";
import variables from "../../../../design-tokens/_variables.module.scss";

const Styled = {
    Container: styled(Container)`
        background-color: ${variables["gray-100"]};
        overflow-y: scroll;
        overflow-x: hidden;
        font-family: "Aktiv Grotesk"
    `,
    Row: styled(Row)`
        margin: 0 2rem 0.5rem 2rem;
    `,
    Button: styled(Button)`
        background-color: ${variables["primary"]};
        color: ${variables["white"]};
        width: 80%;
        margin: auto;
    `,
    ModalFooter: styled(ModalFooter)`
        background-color: ${variables["white"]};
        position: sticky;
        bottom: 0;
        margin: 0 -1rem 0 -1rem;
    `,
    MainText: styled.p`
        color: ${variables["yiq-text-dark"]};
        font-size: 2rem;
        font-weight: 900;
        text-align: left;
        overflow-wrap: break-word;
    `,
    VolunteerNumberText: styled.p`
        color: ${variables["yiq-text-dark"]};
        font-size: 1.3rem;
        font-weight: 900;
        text-align: left;
        margin-left: 1rem;
        padding-top: 0.5rem;
        overflow-wrap: break-word;
    `,
    VolunteerText: styled.p`
        color: ${variables["yiq-text-dark"]};
        font-size: 1rem;
        font-weight: 500;
        text-align: left;
        margin-left: 0.3rem;
        padding-top: 0.8rem;
        overflow-wrap: break-word;
    `,
    SectionText: styled.p`
        color: ${variables["yiq-text-dark"]};
        font-size: 1.3rem;
        font-weight: 900;
        text-align: left;
        margin-left: 1rem;
        overflow-wrap: break-word;
    `,
    LinkedText: styled.p`
        color: ${variables["primary"]};
        font-size: 0.9rem;
        font-weight: 900;
        text-align: left;
        text-decoration: underline;
        margin-left: 1rem;
        padding-top: 0.4rem;
        overflow-wrap: break-word;
    `,
    DetailText: styled.p`
        color: ${variables["gray-400"]};
        font-size: 0.8rem;
        overflow-wrap: break-word;
    `,
    SectionHeaderText: styled.p`
        color: ${variables["yiq-text-dark"]};
        text-align: left;
        font-weight: 900;
        margin-top: 0.8rem;
        overflow-wrap: break-word;
    `,
    VolunteerInfoText: styled(Row)`
        overflow-wrap: break-word;
    `,
    AccomodationText: styled.p`
        color: ${variables["yiq-text-dark"]};
        font-size: 0.8rem;
    `,
    AccomodationRow: styled(Row)`
        margin: -1rem 1rem 0 3.2rem;
    `,
    VolunteerContainer: styled(Col)`
        background-color: ${variables["white"]};
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;
    `,
    VolunteerRow: styled(Row)`
        margin-left: 1rem;
    `,
  };

const EventRegister = (event) => {
    const router = useRouter();
    const { data: session } = useSession();
    const user = session.user;

    const onCompleteRegistration = () => {
        router.replace('/events')
    }

    return (
        <Styled.Container fluid="md">
            <Styled.Row></Styled.Row>
            <Styled.Row>
                <Col xs="12" lg="6">
                    <Styled.MainText>Confirm Registration</Styled.MainText>
                </Col>
                <Col xs="12" lg={{ size: 4, offset: 2}}>
                    <Row>
                        <Styled.VolunteerNumberText>30/100 </Styled.VolunteerNumberText>
                        <Styled.VolunteerText> Spots Remaining</Styled.VolunteerText>
                    </Row>
                </Col>
            </Styled.Row>
            <Styled.Row>
                <Styled.SectionText>Event Information</Styled.SectionText>
                <Styled.LinkedText>Visit Event Page</Styled.LinkedText>
            </Styled.Row>
            <Styled.Row>
                <EventRegisterInfoContainer event={event} user={user}/>
            </Styled.Row>
            <Styled.Row>
                <Styled.SectionText>Your Group</Styled.SectionText>
                <Styled.LinkedText>Add Minor (under 13 years old)</Styled.LinkedText>
            </Styled.Row>
            <Styled.AccomodationRow>
                <FormGroup check>
                    <Input type="checkbox"/>{' '}
                </FormGroup>
                <Styled.AccomodationText>I require accomadation for my court required hours</Styled.AccomodationText>
                <IconSpecial width="20" height="20" viewBox="0 0 20 20" name="info" href="#" id="tooltipShow"/>
                <UncontrolledTooltip placement="right" target="tooltipShow">
                    Here is information about your required court hours. 
                </UncontrolledTooltip>
            </Styled.AccomodationRow>
            <Styled.Row>            
                <Col xs="12" lg="3">
                    <Styled.VolunteerContainer>
                        <Styled.VolunteerRow>
                            <Styled.SectionHeaderText>Fred Burger</Styled.SectionHeaderText>
                        </Styled.VolunteerRow>
                        <Styled.VolunteerRow>
                            <Styled.DetailText>fredfredburger@gmail.com</Styled.DetailText>
                        </Styled.VolunteerRow>
                    </Styled.VolunteerContainer>
                </Col>
                <Col xs="12" lg="3">
                    <Styled.VolunteerContainer>
                        <Styled.VolunteerRow>
                            <Styled.SectionHeaderText>Carlos Burger</Styled.SectionHeaderText>
                        </Styled.VolunteerRow>
                        <Styled.VolunteerRow>
                            <Styled.DetailText>Minor</Styled.DetailText>
                        </Styled.VolunteerRow>
                    </Styled.VolunteerContainer>
                </Col>
            </Styled.Row>  
            <Styled.ModalFooter>
                <Styled.Button onClick={() => onCompleteRegistration()}>Complete Registration</Styled.Button>
            </Styled.ModalFooter>  
        </Styled.Container>

    )
}

EventRegister.propTypes = {
    event: PropTypes.object
};

export default EventRegister;