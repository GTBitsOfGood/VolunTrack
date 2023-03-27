import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { applyTheme, themes } from "../themes/themes";
import { useSession } from "next-auth/react";

const theme = {
  primary: "#b35fd0",
  error: "#F06B6B",
  grey1: "hsl(0, 0%, 10%)",
  grey3: "hsl(0, 0%, 30%)",
  grey5: "hsl(0, 0%, 50%)",
  grey7: "hsl(0, 0%, 75%)",
  grey8: "hsl(0, 0%, 80%)",
  grey9: "hsl(0, 0%, 95%)",
  primaryGrey: "#607177",
  danger: {
    base: "hsl(0, 100%, 63%)",
    text: "hsl(0, 100%, 30%)",
  },
  warning: {
    base: "hsl(55, 76%, 87%)",
    text: "hsl(58, 76%, 25%)",
  },
  success: {
    base: "hsl(128, 43%, 86%)",
    text: "hsl(127, 100%, 21%)",
  },
  default: {
    base: "hsl(0, 0%, 90%)",
    text: "hsl(0, 0%, 30%)",
  },
  color: {
    bodyBg: "rgb(194, 239, 255);",
    dark: "rgba(35, 35, 35, 0.62);",
    secondary: "#efefef;",
    success: "#b35fd0;",
    info: "#626262;",
    warning: "#eff214;",
    primary: "#f79a0d;",
    danger: "#ff6261;",
  },
};

const ThemeWrapper = ({ children }) => {
  const { data: session } = useSession();

  useEffect(() => {
    applyTheme(session.theme);
  }, []);

  return <React.Fragment>{children}</React.Fragment>;
};

export default ThemeWrapper;

ThemeWrapper.propTypes = {
  children: PropTypes.object,
};
