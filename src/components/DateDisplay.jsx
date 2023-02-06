import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import variables from "../design-tokens/_variables.module.scss";

const Styled = {
  Container: styled.div`
    border: 1px;
    width: 60px;
    height: 60px;
    border-radius: 5px;
    border-style: solid;
    margin-right: 10px;
    text-align: center;
    display: flex;
    flex-direction: column;
  `,
  DayText: styled.p`
    border: none;
    margin: -5px;
    display: inline-block;
    padding: 0px;
    font-size: 2rem;
    font-weight: bold;
  `,
  MonthText: styled.p`
    border: none;
    display: inline-block;
    margin: -3px;
    padding: 2px;
  `,
};

class DateDisplayComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { month: "Jan", day: "1", color: "primary" };
  }

  componentDidMount = () => {
    const date = new Date(new Date(this.props.date).getTime() + 86400000); // + 1 day in ms
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.getDate();

    this.setState({
      month: month,
      day: day,
      color: this.props.color,
    });
  };

  render() {
    return (
      <Styled.Container
        style={{
          backgroundColor:
            this.state.color.toLowerCase() === "primary"
              ? variables["secondary"]
              : variables["gray-200"],
          borderColor:
            this.state.color.toLowerCase() === "primary"
              ? variables["primary"]
              : variables["gray-400"],
        }}
      >
        <Styled.MonthText
          style={{
            color:
              this.state.color.toLowerCase() === "primary"
                ? variables["dark"]
                : "black",
          }}
        >
          {this.state.month.toUpperCase()}
        </Styled.MonthText>
        <Styled.DayText
          style={{
            color:
              this.state.color.toLowerCase() === "primary"
                ? variables["dark"]
                : "black",
          }}
        >
          {this.state.day}
        </Styled.DayText>
      </Styled.Container>
    );
  }
}

export default DateDisplayComponent;

DateDisplayComponent.propTypes = {
  date: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
};
