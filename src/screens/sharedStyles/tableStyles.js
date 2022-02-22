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
	font-family:Inter;
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
  width:72px;
	height:49px;
  font-family:Mulish;
	text-align:center;
	font-size:30px;
  line-height:px;
  left:16px;
	top:-4px;
  position:absolute;
`;
const EventName = styled.span`
  width:267px;
	height:24px;
	font-family:Alef;
	text-align:left;
	font-size:16px;
  line-height:px;
  color:${variables.info};
  left:134px;
	top:5px;
  position:absolute;
`;
const Time = styled.span`
  width:446px;
	height:22px;
	left:134px;
	top:32px;
	font-family:Inter;
	text-align:left;
	font-size:18px;
  left:134px;
	top:32px;
  position:absolute;
`;
const Creation = styled.span`
  width:154px;
	height:22px;
  font-family:Inter;
	text-align:right;
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
