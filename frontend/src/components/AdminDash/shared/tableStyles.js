import styled from 'styled-components';
import { FormGroup as BFormGroup, Input, Label as BLabel } from 'reactstrap';

const Container = styled.div`
  background: white;
  width: 95%;
  max-width: 80rem;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 0.1rem solid ${props => props.theme.grey9};
`;
const Table = styled.table`
  width: 100%;

  th {
    color: ${props => props.theme.primaryGrey};
    font-size: 1.2rem;
  }
  th,
  td {
    padding: 1.5rem;
  }
`;
const Row = styled.tr`
  ${props => props.evenIndex && 'background: #F7F7F7'};
  cursor: pointer;
`;
const LoadingBody = styled.div`
  height: 39rem;
  width: 100%;
  display: flex;
  align-items: center;
`;
const TextBox = styled(Input)`
  border: 1px solid ${props => props.theme.grey8};
  border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
  margin-bottom: 1rem;
  margin-top: 0.1rem;
`;

const Label = styled(BLabel)`
  padding-left: 0.2rem;
  font-weight: bold;
  color: ${props => props.theme.primaryGrey};
`;

const FormGroup = styled(BFormGroup)`
  width: 80%;
`;

const Dropdown = styled(Input)`
  border: 1px solid ${props => props.theme.grey8};
  border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
`;

export { Container, Table, Row, LoadingBody, Label, FormGroup, Dropdown, TextBox };
