import { Button } from "flowbite-react";
import React from "react";
import PropTypes from "prop-types";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

class BoGButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Button
        onClick={this.props.onClick ?? (() => {})}
        className={
          this.props.className ??
          "bg-primaryColor hover:bg-hoverColor focus:!outline-none focus:!ring-0"
        }
        size={this.props.size ?? "md"}
        disabled={this.props.disabled}
        outline={this.props.outline}
        type={this.props.type}
      >
        {this.props.text}
        {this.props.dropdown && <ChevronDownIcon className="ml-2 h-5 w-5" />}
      </Button>
    );
  }
}

export default BoGButton;

BoGButton.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  outline: PropTypes.bool,
  dropdown: PropTypes.bool,
  type: PropTypes.string,
};
