import { Button } from "flowbite-react";
import React from "react";
import PropTypes from "prop-types";

class BoGButton extends React.Component {
    constructor(props) {
        super(props);
        const styling = "bg-primaryColor hover:bg-hoverColor";
    }
  
    render() {
        if (this.props.size) {
            return (
                <Button onClick={this.props.onClick} className={this.styling} size={this.props.size} disabled={this.props.disabled} outline={this.props.outline}>
                    {this.props.text}
                </Button>
            );
        } else {
            return (
                <Button onClick={this.props.onClick} className={this.styling}  disabled={this.props.disabled} outline={this.props.outline}>
                    {this.props.text}
                </Button>
            );
        }
    }
}
  
export default BoGButton;

Button.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    size: PropTypes.string,
    disabled: PropTypes.bool,
    outline: PropTypes.bool,
};
  