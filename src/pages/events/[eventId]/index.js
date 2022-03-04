import React from "react";
import {useRouter} from 'next/router';
import styled from "styled-components";
// import variables from "../../../design-tokens/_variables.module.scss";

const Styled = {
    EventTable: styled.div`
        display: flex;
        flex-direction: row;
        margin-top: 2rem;
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
        flex-direction: row;
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
            <Styled.EventCol>
                <Styled.InfoHead>Event Information</Styled.InfoHead>
                <Styled.InfoTable>

                </Styled.InfoTable>
            </Styled.EventCol>
        </Styled.EventTable>
        </>
    )};

export default EventInfo;