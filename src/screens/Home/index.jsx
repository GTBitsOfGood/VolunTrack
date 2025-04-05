import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { useSession } from "next-auth/react";
import { loadPage, getAboutPageToggle } from "../../queries/organizations";

const CustomHome = () => {
  const [pageContent, setPageContent] = useState("");
  const [pageToggle, setPageToggle] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.organizationId) {
      loadPage(session.user.organizationId.toString())
        .then((response) => {
          if (response.data.homePage) {
            const sanitizedHomePage = DOMPurify.sanitize(
              response.data.homePage
            );
            setPageContent(sanitizedHomePage);
            console.log("Successfully loaded page!");
          } else {
            console.error("Error loading home page:", response.data.error);
          }
        })
        .catch((error) => console.error("API request error:", String(error)));
      getAboutPageToggle(session.user.organizationId.toString())
        .then((response) => {
          if (response.data.aboutPageToggle !== undefined) {
            setPageToggle(response.data.aboutPageToggle);
          } else {
            console.error(
              "Error loading aboutPageToggle:",
              response.data.error
            );
          }
        })
        .catch((error) => console.error("API request error:", String(error)));
    }
  }, [session]);

  return (
    <>
      {pageToggle ? (
        <div className="flex items-center justify-center">
          <div
            className="w-[80vw]"
            dangerouslySetInnerHTML={{ __html: pageContent }}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <h4>
            This page is currentely under construction, please check back later!
          </h4>
        </div>
      )}
    </>
  );
};

export default CustomHome;
