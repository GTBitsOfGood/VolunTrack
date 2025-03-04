import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { applyTheme } from "../themes/themes";
import { useSession } from "next-auth/react";

const ThemeWrapper = ({ children }) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      applyTheme(session.theme);
    } else {
      applyTheme("purple");
    }
  }, []);

  return <React.Fragment>{children}</React.Fragment>;
};

export default ThemeWrapper;

ThemeWrapper.propTypes = {
  children: PropTypes.object,
};
