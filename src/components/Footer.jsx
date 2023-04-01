import "flowbite-react";
import { Footer, Navbar } from "flowbite-react";

export const AppFooter = () => {
  return (
    <Footer container={true} className="bg-transparent py-0">
      <div className="align-items-center w-full text-center">
        <div className="flex w-full items-center justify-between">
          <a href="https://bitsofgood.org">
            <img
              src="/images/bog_hack4impact_logo.png"
              alt="bits of good logo"
              className="h-24"
            />
          </a>
          <Footer.LinkGroup>
            <div className="flex flex-col text-right">
              <a
                href="https://bitsofgood.org"
                className="pr-4 hover:no-underline md:hover:text-primaryColor"
              >
                Copyright (c) 2023 by Bits of Good
              </a>

              <a
                href="https://www.netlify.com"
                className="pr-4 hover:no-underline md:hover:text-primaryColor"
              >
                Powered by Netlify
              </a>
            </div>
          </Footer.LinkGroup>

          {/* <div>
            Copyright (c) 2023 by Bits of Good. Powered by Netlify.
          </div> */}
        </div>
        {/*<Footer.Divider />*/}
        {/* <Footer.Copyright href="#" by="Flowbite™" year={2022} /> */}
      </div>
    </Footer>
  );
};

export default AppFooter;
