import "flowbite-react";
import { Footer, Navbar } from "flowbite-react";

export const AppFooter = () => {
  return (
    <Footer container={true} className="py-0">
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
            <Navbar.Link
              href="https://bitsofgood.org"
              className="hover:no-underline md:hover:text-primaryColor"
            >
              Bits of Good
            </Navbar.Link>
            <Navbar.Link
              href="https://bitsofgood.org/contact"
              className="hover:no-underline md:hover:text-primaryColor"
            >
              Contact Us
            </Navbar.Link>
            <Navbar.Link
              href="https://www.netlify.com"
              className="hover:no-underline md:hover:text-primaryColor"
            >
              Powered by <u>Netlify</u>
            </Navbar.Link>
          </Footer.LinkGroup>
        </div>
        {/*<Footer.Divider />*/}
        {/*<Footer.Copyright href="#" by="Flowbite™" year={2022} />*/}
      </div>
    </Footer>
  );
};

export default AppFooter;
