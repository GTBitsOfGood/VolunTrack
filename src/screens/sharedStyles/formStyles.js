import {
  FormGroup as BFormGroup,
  Input as BInput,
  Label as BLabel,
} from "reactstrap";
import styled from "styled-components";

const Input = styled(BInput)`
  border: 1px solid hsl(0, 0%, 80%);
  border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
  margin-bottom: 1rem;
  margin-top: 0.1rem;
`;

const Label = styled(BLabel)`
  padding-left: 0.2rem;
  font-weight: bold;
  color: hsl(0, 0%, 80%);
  margin-right: 0.5rem;
`;

const FormGroup = styled(BFormGroup)`
  width: 92%;
`;

const Dropdown = styled(Input)`
  border: 1px solid hsl(0, 0%, 80%);
  border-radius: 0.5rem 0.5rem 0.5rem 0.5rem;
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
`;
export { Input, Label, FormGroup, Dropdown };
