import React from "react";
import PropTypes from "prop-types";

class Text extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.href) {
      return (
        <a
          className={
            "text-sm text-primaryColor underline hover:text-hoverColor " +
            this.props.className
          }
          href={this.props.href}
        >
          {this.props.text}
        </a>
      );
    } else {
      let theming = "text-sm ";
      switch (this.props.type) {
        case "header":
          return (
            <h1 className={"mb-0 text-4xl font-bold " + this.props.className}>
              {this.props.text}
            </h1>
          );
        case "subheader":
          return (
            <h3 className={"mb-0 text-xl font-bold " + this.props.className}>
              {this.props.text}
            </h3>
          );
        case "subtitle":
          return (
            <h3 className={"text-base font-bold " + this.props.className}>
              {this.props.text}
            </h3>
          );
        case "helper":
          theming = "text-gray-400 ";
          break;
        default:
          theming = "text-md ";
      }
      return (
        <p className={theming + " mb-0 " + this.props.className}>
          {this.props.text}
        </p>
      );
    }
  }
}

export default Text;

Text.propTypes = {
  text: PropTypes.string.isRequired,
  type: PropTypes.string,
  // children: PropTypes.arrayOf(PropTypes.element),
  className: PropTypes.string,
  href: PropTypes.string,
};
