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
  height: 70px;

  cursor: pointer;
`;

const Inner = styled.div`
  background-color: white;
  width: 100%;
  border: 1px solid ${variables["gray-200"]};
  border-top-left-radius: 1px;
  border-top-right-radius: 1px;
  border-bottom-left-radius: 1px;
  border-bottom-right-radius: 1px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px;
  padding-left: 20px;
  height: 100%;
`;

const InnerTop = styled.div`
  background-color: white;
  width: 100%;
  border: 1px solid ${variables["gray-200"]};
  border-top-left-radius: 1px;
  border-top-right-radius: 1px;
  border-bottom-left-radius: 1px;
  border-bottom-right-radius: 1px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px;
  padding-left: 20px;
  height: 100%;
  color: rgba(150, 0, 52, 1);
  font-weight: bold;
`;

const Slots = styled.span`
  font-size: 12px;
  color: ${variables["gray-300"]};
  margin: 5px;
`;
const Edit = styled.div`
  width: 12px;
  height: 12px;
  left: 606px;
  top: 10px;
  position: absolute;
`;
const Delete = styled.div`
  width: 12px;
  height: 12px;
  left: 666px;
  top: 10px;
  position: absolute;
`;
const Text = styled.div`
  border-radius: 1px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const TextInfo = styled.div`
  border-radius: 1px;
  display: flex;
  flex-direction: column;
  margin: 12px;
  font-size: 15px;
  width: 25%;
  text-align: center;
`;
const Volunteers = styled.div`
  text-align: left;
  font-size: 12px;
  color: gray;
`;
const EventName = styled.div`
  font-size: 15px;
  text-align: left;
  margin-right: 10px;
  width: 25%;
`;
const Time = styled.div`
  font-size: 15px;
  width: 25%;
  text-align: center;
`;
const Creation = styled.div`
  font-size: 15px;
  text-align: center;
  width: 25%;
`;
const Register = styled.div`
  width: 10rem;
  height: 12px;
  left: 606px;
  top: 10px;
  position: absolute;
`;
const UnRegister = styled.div`
  width: 10rem;
  height: 12px;
  left: 606px;
  top: 10px;
  position: absolute;
`;
const TitleAddNums = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export {
  Container,
  EventList,
  Inner,
  InnerTop,
  Slots,
  Edit,
  Delete,
  Text,
  TextInfo,
  Volunteers,
  EventName,
  Time,
  Creation,
  Register,
  UnRegister,
  Table,
  Row,
  LoadingBody,
  TitleAddNums,
};
