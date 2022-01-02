import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  button {
    border: none;
    background: none;
    position: relative;
    padding-left: 0;
    cursor: pointer;
  }
`;

const OptionContainer = styled.div`
  width: 12rem;
  background: white;
  border: 1px solid ${props => props.theme.grey7};
  border-radius: 0.5rem;
  padding: 0 0.4rem;
  overflow: hidden;
  transition: transform 0.05s;
  transform-origin: top;
  transform: ${props => (props.expanded ? 'scaleY(1)' : 'scaleY(0);')};

  button {
    padding-left: 0.5rem;
  }
`;

const FlexContainer = styled.div`
  position: absolute;
  top: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: visible;
  ${({ screenEdgeAlign }) =>
    screenEdgeAlign &&
    `
  @media (min-width: 60rem) {
    align-items: flex-end;
  }
  `}
`;

const Option = styled.button`
  width: 100%;
  padding: 0.5rem;
  text-align: left;

  :hover {
    background: ${props => props.theme.grey9};
  }
`;

class DropdownSelect extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: false
    };
  }
  onToggle = () => {
    this.setState({ expanded: !this.state.expanded });
  };
  onSelect = selected => {
    this.props.updateCallback(selected);
    this.onToggle();
  };
  render() {
    const { options, screenEdgeAlign, children } = this.props;
    return (
      <Container>
        <button onClick={this.onToggle}>{children}</button>
        <FlexContainer screenEdgeAlign={screenEdgeAlign}>
          <OptionContainer expanded={this.state.expanded}>
            {Object.entries(options).map(([key, label]) => (
              <Option key={key} onClick={() => this.onSelect(key)}>
                {label}
              </Option>
            ))}
          </OptionContainer>
        </FlexContainer>
      </Container>
    );
  }
}
export default DropdownSelect;
