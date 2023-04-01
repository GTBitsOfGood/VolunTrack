import React from "react";
import PropTypes from "prop-types";

class Text extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.href ? (
      <a
        className={
          "text-sm text-primaryColor underline hover:text-hoverColor " +
          this.props.className
        }
        href={this.props.href}
      >
        {this.props.text}
      </a>
    ) : (
      <p>{this.props.text}</p>
    );
  }
}

export default Text;

Text.propTypes = {
  text: PropTypes.string.isRequired,
  // children: PropTypes.arrayOf(PropTypes.element),
  className: PropTypes.string,
  href: PropTypes.string,
};
