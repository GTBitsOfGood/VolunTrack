import "focus-visible/dist/focus-visible.min.js";
import { SessionProvider } from "next-auth/react";
import "normalize.css";
import PropTypes from "prop-types";
import "../../public/static/styles/App.css";
import "../../public/static/styles/bootstrap.min.css";
import "tailwindcss/tailwind.css";
import Header from "../components/Header";
import AuthProvider from "../providers/AuthProvider";
import RequestProvider from "../providers/RequestProvider";
import ThemeWrapper from "../providers/StyleProvider";
import Footer from "../components/Footer";

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
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
          <ThemeWrapper>
            <div className="flex-column flex min-h-screen w-screen overflow-x-hidden overflow-y-scroll">
              <Header />
              <Component {...pageProps} />
              <div className="grow" />
              <Footer />
            </div>
          </ThemeWrapper>
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
