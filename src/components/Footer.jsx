import "flowbite-react";
import { Footer } from "flowbite-react";

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
            <div className="flex flex-col items-end">
              <a
                href="https://bitsofgood.org"
                className="md:hover:text-primaryColor pr-4 hover:no-underline"
              >
                Copyright (c) 2023 by Bits of Good
              </a>

              <a
                href="https://www.netlify.com"
                className="md:hover:text-primaryColor flex pr-4 hover:no-underline"
              >
                Powered by
                <p className="md:hover:text-primaryColor pl-1 underline">
                  Netlify
                </p>
              </a>
            </div>
          </Footer.LinkGroup>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
