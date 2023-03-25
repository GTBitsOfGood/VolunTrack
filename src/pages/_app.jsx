import "focus-visible/dist/focus-visible.min.js";
import { SessionProvider } from "next-auth/react";
import "normalize.css";
import PropTypes from "prop-types";
import { useEffect } from "react";
import "../../public/static/styles/App.css";
import "../../public/static/styles/bootstrap.min.css";
import "tailwindcss/tailwind.css";
import Header from "../components/Header";
import AuthProvider from "../providers/AuthProvider";
import { useState } from "react";
import { useSession } from "next-auth/react";
import RequestProvider from "../providers/RequestProvider";
import StyleProvider from "../providers/StyleProvider";
import {
  blueTheme,
  redTheme,
  orangeTheme,
  yellowTheme,
  greenTheme,
  lightBlueTheme,
  purpleTheme,
  magentaTheme,
} from "../themes/themes";
import { applyTheme } from "../themes/utils";
import { getOrganizationData } from "../actions/queries";
import Footer from "../components/Footer";

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  // const [color, setColor] = useState("Blue");

  // const loadData = async () => {
  //   console.log("HERE!")
  //   console.log(session)
  //   const data = await getOrganizationData(session.user.organizationId);

  //   if (data) {

  //     setImageURL(data.data.orgData.imageURL);

  //   }
  // };
  // useEffect(() => {
  //   loadData();
  // }, []);

  useEffect(() => {
    applyTheme(magentaTheme);
  }, []);

  return (
    <SessionProvider session={session}>
      <script
        type="text/javascript"
        src="https://go.playerzero.app/record/6316bdb7c836d318b2c5ab77"
        async
        crossOrigin={"true"}
      />

      <RequestProvider>
        <AuthProvider>
          <StyleProvider>
            <div className="flex-column flex min-h-screen w-screen overflow-x-hidden overflow-y-scroll">
              <Header />
              <Component {...pageProps} />
              <div className="grow" />
              <Footer />
            </div>
          </StyleProvider>
        </AuthProvider>
      </RequestProvider>
    </SessionProvider>
  );
};

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default App;
