import styled from "styled-components";
import variables from "../../design-tokens/_variables.module.scss";

const Container = styled.div`
  background: white;
  width: 95%;
  max-width: 80rem;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 0.1rem solid ${(props) => props.theme.grey9};
`;

const Table = styled.table`
  width: 100%;

  th {
    color: ${(props) => props.theme.primaryGrey};
    font-size: 1.2rem;
  }
  th,
  td {
    padding: 1.5rem;
  }
`;
const Row = styled.tr`
  ${(props) => props.evenIndex && "background: #FFFFFF"};
  cursor: pointer;
  border-bottom: 2px solid #f0f0f0;
`;
const LoadingBody = styled.div`
  height: 39rem;
  width: 100%;
  display: flex;
  align-items: center;
`;

const EventList = styled.div`
  width: 730px;
  height: 94px;
  position:absolute;
  cursor: pointer;
`;
const Inner = styled.div`
  background-color: white;
	width: 730px;
	height: 94px;
  border: 1px solid ${variables['gray-200']};
  border-top-left-radius:8px;
	border-top-right-radius:8px;
	border-bottom-left-radius:8px;
	border-bottom-right-radius:8px;
  left:0px;
	top:0px
  position:absolute;
`;
const Slots = styled.span`
  width:39px;
	height:14px;
	text-align:left;
	font-size:12px;
  color: ${variables['gray-300']};
  line-height:px;
  left:56px;
	top:57px;
  position:absolute;
`;
const Edit = styled.div`
  width:12px;
	height:12px;
  left:606px;
	top:10px;
  position:absolute;
`;
const Delete = styled.div`
  width:12px;
  height:12px;
  left:666px;
	top:10px;
  position:absolute;
`;
const Text = styled.div`
  width:646px;
	height:63px;
  left:23px;
	top:20px;
  border-radius:1px;
  position:absolute;
`;
const Volunteers = styled.span`
  text-align:left;
  font-size:12px;
  line-height:px;
  left: 200px;
  color:gray;
  top:8px;
  position:absolute;
`;
const EventName = styled.span`
	height:24px;
	text-align:left;
	font-size:16px;
  font-weight: bold;
  line-height:px;
  color:black;
	top:5px;
  position:absolute;
`;
const Time = styled.span`
  width:446px;
	height:22px;
	top:32px;
	text-align:left;
	font-size:18px;
	top:32px;
  position:absolute;
`;
const Creation = styled.span`
  width:154px;
	height:22px;
	text-align:right;
  color: gray;
	font-size:12px;
  line-height:px;
  left:556px;
	top:63px;
  position:absolute;
`;
const Register = styled.div`
  width:10rem;
  height:12px;
  left:606px;
  top:10px;
  position:absolute;
`;
const UnRegister = styled.div`
  width:10rem;
  height:12px;
  left:606px;
  top:10px;
  position:absolute;
`;


export { Container, EventList, Inner, Slots, Edit, Delete, Text, Volunteers, EventName, Time, Creation, Register, UnRegister, Table, Row, LoadingBody };
