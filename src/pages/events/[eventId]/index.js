import React from "react";
import {useRouter} from 'next/router';
import styled from "styled-components";
import { Button } from "reactstrap";
import variables from "../../../design-tokens/_variables.module.scss";

const Styled = {
    Button: styled(Button)`
        background-color: ${variables["primary"]};
        color: white;
        margin-bottom: 2rem;
        margin-left: 4rem;
        margin-right: 4rem;
        font-size: 20px;
        position: fixed;
        bottom: 0;
        width: 90%;
    `,
    EventTable: styled.div`
        display: flex;
        flex-direction: row;
        padding-top: 2rem;
        padding-bottom: 4rem;
        background-color: ${variables["gray-100"]};
        height: 100vh;
    `,
    EventCol: styled.div`
        display: flex;
        flex-direction: column;
        margin-left: 4rem;
        margin-right: 4rem;
    `,
    EventName: styled.h1`
        color: black;
        font-weight: bold;
        margin-bottom: 4px;
        font-size: 40px;
    `,
    EventSubhead: styled.div`
        display: flex;
        flex-direction: row;
    `,
    Slots: styled.p`
        font-weight: 600;
        margin-right: 20px;
    `,
    Date: styled.p`
        font-weight: 200;
    `,
    Info: styled.p`
        font-size: 18px;
    `,
    InfoHead: styled.h1`
        font-size: 25px;
        font-weight: bold;
    `,
    InfoTable: styled.div`
        display: flex;
        flex-direction: column;
    `,
    InfoTableRow: styled.div`
        display: flex;
        flex-direction: row;
        background-color: white;
        padding-right: 5rem;
    `,
    InfoTableText: styled.p`
        font-size: 16px;
        margin: 20px;
    `
};

const EventInfo = (event) => {
    const router = useRouter()
    const { eventId } = router.query

    return (
        <>
        <Styled.EventTable>
            <Styled.EventCol>
                <Styled.EventName>Event Name</Styled.EventName> 
                <Styled.EventSubhead>
                    <Styled.Slots>Slots Created</Styled.Slots>
                    <Styled.Date>Date Here</Styled.Date>
                </Styled.EventSubhead>
                <Styled.Info>[DescriptionFiller] Lorem ipsum dolor sit amet, consectetur adipiscing elit</Styled.Info>
                <Styled.Info><b>Age Requirement:</b> 13+</Styled.Info>
                <Styled.Info>
                    <b>Dress Code:</b>
                    <br></br>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </Styled.Info>
                <Styled.Info>
                    <b>Important Notes:</b>
                    <br></br>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                </Styled.Info>
            </Styled.EventCol>
            <Styled.EventCol style={{"margin-left": "auto"}}>
                <Styled.InfoHead>Event Information</Styled.InfoHead>
                <Styled.InfoTable>
                    <Styled.InfoTableRow>
                        <Styled.InfoTableText>
                            <b>Date:</b>
                            <br></br>
                            09/02/22
                        </Styled.InfoTableText>
                        <Styled.InfoTableText>
                            <b>Time:</b>
                            <br></br>
                            9:05AM - 1:14PM
                        </Styled.InfoTableText>
                    </Styled.InfoTableRow>

                    <Styled.InfoTableRow>
                        <Styled.InfoTableText>
                            <b>Location:</b>
                            <br></br>
                            Address
                        </Styled.InfoTableText>
                        <Styled.InfoTableText>
                            <b>Contact:</b>
                            <br></br>
                            Phone
                            <br></br>
                            Email
                        </Styled.InfoTableText>
                    </Styled.InfoTableRow>
                </Styled.InfoTable>
            </Styled.EventCol>
        </Styled.EventTable>
        <Styled.Button>
            Register
        </Styled.Button>
        </>
    )};

export default EventInfo;