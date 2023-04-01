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
      )
    } else {
      let theming = "text-sm ";
      switch (this.props.theme) {
        case "helper":
          theming = "text-sm text-gray "
          break;
        case "header":
          return (
            <h1 className={"text-4xl font-bold " + this.props.className}>{this.props.text}</h1>
          );
        case "subheading":
          theming = "text-xl text-bold "
          break;
      }
      theming = theming + this.props?.className;
      return (
        <p className={theming}>{this.props.text}</p>
      );
    }
  }
}

export default Text;

Text.propTypes = {
  text: PropTypes.string.isRequired,
  theme: PropTypes.string,
  // children: PropTypes.arrayOf(PropTypes.element),
  className: PropTypes.string,
  href: PropTypes.string,
};
