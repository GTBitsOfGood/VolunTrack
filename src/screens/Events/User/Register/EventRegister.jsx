import React from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Modal, ModalHeader, ModalFooter, Row, Col, Button, Container, FormGroup, Label, Input } from "reactstrap";
import { Form as FForm, ErrorMessage } from "formik";
import Icon from "../../../../components/Icon";

import PropTypes from "prop-types";
import variables from "../../../../design-tokens/_variables.module.scss";
// background-color: ${variables["gray-200"]};

const Styled = {
    Modal: styled(Modal)`
        background: red;
    `,
    Form: styled(FForm)``,
    ModalHeader: styled(ModalHeader)`
      border-color: transparent;
      p {
        color: ${variables["dark"]};
        font-weight: 700;
        margin-top: 2rem;
        margin-left: 4.5rem;
        padding-right: 3.5rem;
        padding-left: 3.5rem;
        border-bottom: 2px solid ${variables["dark"]};
      }
    `,
    HeaderText: styled.p`
      color: ${variables["dark"]};
      font-weight: 900;
      font-size: 1.2em;
      border-bottom: 2px solid ${variables["dark"]};
      padding-right: 3.5rem;
      padding-left: 2rem;
      margin-left: 5rem;
      margin-right: 5rem;
      text-align: center;
      display: inline;
    `,
    MainContainer: styled(Container)`
        margin-left: "0px",
        margin-right: "0px",
        max-width: "100%",
    `,
    Container: styled(Container)`
        background-color: ${variables["gray-100"]};
        overflow-y: scroll;
        overflow-x: hidden;
    `,
    Row: styled(Row)`
        margin-bottom: 0.2rem;
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
    EventContainer: styled(Container)`
      background-color: ${variables["white"]};
      margin: 0.1rem;
      border-radius: 0.5rem;
    `,
    MainText: styled.p`
        color: ${variables["yiq-text-dark"]};
        font-size: 2.5rem;
        font-weight: 900;
        text-align: left;
    `,
    VolunteerText: styled.p`
        color: ${variables["yiq-text-dark"]};
        font-size: 1.5rem;
        text-align: right;
        font-weight: 600;
        padding: 1rem 0 0;
    `,
    SectionText: styled.p`
        color: ${variables["yiq-text-dark"]};
        font-size: 1.3rem;
        font-weight: 900;
        text-align: left;
    `,
    TooltipText: styled.p`
        color: ${variables["primary"]};
        font-size: 1rem;
        font-weight: 900;
        text-align: left;
        text-decoration: underline;
        margin-left: 0.5rem;
    `,
    ContactText: styled.p`
        color: ${variables["primary"]};
        font-size: 1rem;
        font-weight: 900;
        margin-left: 0.5rem;
    `,
    DetailText: styled.p`
        color: ${variables["gray-400"]};
        font-size: 0.8rem;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    `,
    EventInfoText: styled.p`
        color: ${variables["dark"]};
        font-size: 1rem;
        font-weight: 600;
        margin-left: 0.5rem;
    `,
    EventTitleText: styled.p`
        color: ${variables["dark"]};
        font-size: 1.5rem;
        font-weight: 900;
        margin-top: 1rem;
    `,
    EventRow: styled(Row)`
        margin: 0 1rem 0 1rem;
    `,
    VolunteerNameText: styled.p`
        color: ${variables["yiq-text-dark"]};
        text-align: center;
        font-weight: 900;
        padding: 1rem 1rem 0 1rem;
    `,
    VolunteerInfoText: styled(Row)`
    `,
    EventInfoCol: styled(Col)`
        background-color: ${variables["gray-100"]};
        margin: 0 2rem 0.5rem 0;
        border-radius: 0.5rem;
    `,


  };

const EventRegister = ({open, toggle, event, user}) => {
    const fullScreen = true; // doesn't take in fullscreen right now
    // const volunteerSpots = {
    //     currNum: event.volunteers, // currently event.volunteers is null
    //     maxNum: event.max_volunteers
    // }

    const router = useRouter();

    const onCompleteRegistration = () => {
        router.replace('/events')
    }

    console.log(event)
    console.log("hello")
    console.log(user)
    return (
            <Styled.Container fluid="md">
                <Styled.Row>
                    <Col>
                        <Styled.MainText>Confirm Registration</Styled.MainText>
                    </Col>
                    <Col>
                        {/* <h2>{event.volunteers.length}/{event.max_volunteers} Spots Remaining</h2> */}
                        <Styled.VolunteerText>30/100 Spots Remaining</Styled.VolunteerText>
                    </Col>
                </Styled.Row>
                <Styled.Row>
                    <Styled.SectionText>Event Information</Styled.SectionText>
                    <Styled.TooltipText>Visit Event Page</Styled.TooltipText>
                    {/* <Col xs="6" sm="3">
                        <Styled.SectionText>Event Information</Styled.SectionText>
                        <Styled.TooltipText>Visit Event Page</Styled.TooltipText>
                    </Col>
                    <Col xs="6" sm="3">
                        <Styled.TooltipText>Visit Event Page</Styled.TooltipText>
                    </Col> */}
                </Styled.Row>
                <Styled.Row>
                    <Styled.EventContainer>
                        <Styled.EventRow>
                            <Styled.EventTitleText>Warehouse Loading</Styled.EventTitleText>
                        </Styled.EventRow>
                        <Styled.EventRow>
                            <Styled.DetailText>Help us move boxes from our trucks to the warehouse.</Styled.DetailText>
                        </Styled.EventRow>
                        <Styled.EventRow>
                            <Styled.EventInfoCol xs="2">
                                <Row>
                                    <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.8475 6.26904H7.24434C6.01329 6.26904 5.01532 7.26701 5.01532 8.49806V24.1012C5.01532 25.3322 6.01329 26.3302 7.24434 26.3302H22.8475C24.0785 26.3302 25.0765 25.3322 25.0765 24.1012V8.49806C25.0765 7.26701 24.0785 6.26904 22.8475 6.26904Z" stroke="black" stroke-width="1.88073" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M20.0612 3.76123V8.77652" stroke="black" stroke-width="1.88073" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M10.0306 3.76123V8.77652" stroke="black" stroke-width="1.88073" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M5.01532 12.5381H25.0765" stroke="black" stroke-width="1.88073" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <Styled.EventInfoText>March 19</Styled.EventInfoText>
                                </Row>
                            </Styled.EventInfoCol>
                            <Styled.EventInfoCol xs="3">
                                <Row>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M12 7V12.25L16 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <Styled.EventInfoText>7:00AM - 4:00PM</Styled.EventInfoText>
                                </Row>
                            </Styled.EventInfoCol>
                            <Styled.EventInfoCol xs="4">
                                <Row>
                                    <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.607 25.8466C14.8442 26.115 15.2476 26.115 15.4848 25.8466C17.0928 24.0267 22.5688 17.3817 22.5688 11.2842C22.5688 7.12936 19.2007 3.76123 15.0459 3.76123C10.8911 3.76123 7.52293 7.12936 7.52293 11.2842C7.52293 17.3817 12.999 24.0267 14.607 25.8466Z" stroke="black" stroke-width="1.88073"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0459 13.7921C16.4308 13.7921 17.5535 12.6694 17.5535 11.2845C17.5535 9.89957 16.4308 8.77686 15.0459 8.77686C13.6609 8.77686 12.5382 9.89957 12.5382 11.2845C12.5382 12.6694 13.6609 13.7921 15.0459 13.7921Z" stroke="black" stroke-width="1.88073"/>
                                    </svg>
                                    <Styled.EventInfoText>521 Waffleburger Dr SW</Styled.EventInfoText>
                                </Row>
                            </Styled.EventInfoCol>
                        </Styled.EventRow>
                        <Styled.EventRow>
                            <Col>
                                <Row>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="2" y="5" width="20" height="14" rx="0.5" stroke="#EF4E79" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M2 5L11.6655 13.699C11.8557 13.8701 12.1443 13.8701 12.3345 13.699L22 5" stroke="#EF4E79" stroke-width="1.5"/>
                                    <path d="M2 19L9 11" stroke="#EF4E79" stroke-width="1.5"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M22 19L15 11L22 19Z" stroke="#EF4E79" stroke-width="1.5"/>
                                    </svg>
                                    <Styled.ContactText>helping@gmail.com</Styled.ContactText>
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 15.9201V18.9201C21.0011 19.1986 20.9441 19.4743 20.8325 19.7294C20.7209 19.9846 20.5573 20.2137 20.3521 20.402C20.1468 20.5902 19.9046 20.7336 19.6407 20.8228C19.3769 20.912 19.0974 20.9452 18.82 20.9201C15.7428 20.5857 12.787 19.5342 10.19 17.8501C7.77382 16.3148 5.72533 14.2663 4.18999 11.8501C2.49997 9.2413 1.44824 6.27109 1.11999 3.1801C1.095 2.90356 1.12787 2.62486 1.21649 2.36172C1.30512 2.09859 1.44756 1.85679 1.63476 1.65172C1.82196 1.44665 2.0498 1.28281 2.30379 1.17062C2.55777 1.05843 2.83233 1.00036 3.10999 1.0001H6.10999C6.5953 0.995321 7.06579 1.16718 7.43376 1.48363C7.80173 1.80008 8.04207 2.23954 8.10999 2.7201C8.23662 3.68016 8.47144 4.62282 8.80999 5.5301C8.94454 5.88802 8.97366 6.27701 8.8939 6.65098C8.81415 7.02494 8.62886 7.36821 8.35999 7.6401L7.08999 8.9101C8.51355 11.4136 10.5864 13.4865 13.09 14.9101L14.36 13.6401C14.6319 13.3712 14.9751 13.1859 15.3491 13.1062C15.7231 13.0264 16.1121 13.0556 16.47 13.1901C17.3773 13.5286 18.3199 13.7635 19.28 13.8901C19.7658 13.9586 20.2094 14.2033 20.5265 14.5776C20.8437 14.9519 21.0122 15.4297 21 15.9201Z" stroke="#EF4E79" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    <Styled.ContactText>123-456-7890</Styled.ContactText>
                                </Row>
                            </Col>
                        </Styled.EventRow>
                    </Styled.EventContainer>
                </Styled.Row>
                <Styled.Row>
                    <Container>
                        <Row>
                            <Styled.SectionText>Your Group</Styled.SectionText>
                            <Styled.TooltipText>Add Minor (under 13 years old)</Styled.TooltipText>
                        </Row>
                        <Row>
                            <FormGroup check>
                                <Input type="checkbox" />{' '}
                            </FormGroup>
                            <h6>I require accomadation for my court required hours</h6>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 13.3333L10 9.16659" stroke="#EF4E79" stroke-width="1.25" stroke-linecap="round"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10 5.83333C9.53976 5.83333 9.16666 6.20643 9.16666 6.66667C9.16666 7.1269 9.53976 7.5 10 7.5C10.4602 7.5 10.8333 7.1269 10.8333 6.66667C10.8333 6.20643 10.4602 5.83333 10 5.83333Z" fill="#EF4E79"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10 1.66659C5.39763 1.66659 1.66667 5.39755 1.66667 9.99992C1.66666 14.6023 5.39762 18.3333 10 18.3333C14.6024 18.3333 18.3333 14.6023 18.3333 9.99992C18.3333 5.39755 14.6024 1.66659 10 1.66659Z" stroke="#EF4E79" stroke-width="1.25"/>
                            </svg>
                        </Row>
                        <Row>
                            <Col xs="4">
                                <Styled.EventContainer>
                                    <Row>
                                        <Styled.VolunteerNameText>Fred Burger</Styled.VolunteerNameText>
                                    </Row>
                                    <Row>
                                        <Styled.DetailText>fredfredburger@gmail.com</Styled.DetailText>
                                    </Row>
                                </Styled.EventContainer>
                            </Col>
                            <Col xs="4">
                                <Styled.EventContainer>
                                    <Row>
                                        <Styled.VolunteerNameText>Carlos Burger</Styled.VolunteerNameText>
                                    </Row>
                                    <Row>
                                        <Styled.DetailText>Minor</Styled.DetailText>
                                    </Row>
                                </Styled.EventContainer>
                            </Col>
                        </Row>
                    </Container>
                </Styled.Row>  
                <Styled.ModalFooter>
                    <Styled.Button onClick={() => onCompleteRegistration()}>Complete Registration</Styled.Button>
                </Styled.ModalFooter>  
            </Styled.Container>

    )
}

EventRegister.propTypes = {
    open: PropTypes.bool,
    toggle: PropTypes.func,
    event: PropTypes.object,
    user: PropTypes.object
};

export default EventRegister;