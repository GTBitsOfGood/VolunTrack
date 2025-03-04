import "focus-visible/dist/focus-visible.min.js";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import "normalize.css";
import PropTypes from "prop-types";
import "tailwindcss/tailwind.css";
import "../../public/static/styles/App.css";
import "../../public/static/styles/bootstrap.min.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import AuthProvider from "../providers/AuthProvider";
import RequestProvider from "../providers/RequestProvider";
import ThemeWrapper from "../providers/StyleProvider";

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  const router = useRouter();
  const isPublicPage = router.pathname.startsWith("/embed");
  // const isPublicPage = false;
  return (
    <SessionProvider session={session}>
      <script
        type="text/javascript"
        src="https://go.playerzero.app/record/6316bdb7c836d318b2c5ab77"
        async
        crossOrigin={"true"}
      />
      {isPublicPage ? (
        <ThemeWrapper>
          <div className="flex-column flex min-h-screen w-screen overflow-x-hidden">
            <Component {...pageProps} />
            {/* <EmbedPage organizationId="63d6dcc4e1fb5fd6e69b1738" /> */}
            <div className="grow" />
            <Footer />
          </div>
        </ThemeWrapper>
      ) : (
        <RequestProvider>
          <AuthProvider>
            <ThemeWrapper>
              <div className="flex-column flex min-h-screen w-screen overflow-x-hidden">
                <Header />
                <Component {...pageProps} />
                <div className="grow" />
                <Footer />
              </div>
            </ThemeWrapper>
          </AuthProvider>
        </RequestProvider>
      )}
    </SessionProvider>
  );
};

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default App;
