import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import { useSession } from "next-auth/react";
import { loadPage } from "../../queries/organizations";

const CustomHome = () => {
  const [pageContent, setPageContent] = useState("");
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
    }
  }, [session]);

  return (
    <div className="flex items-center justify-center">
      <div
        className="w-[80vw]"
        dangerouslySetInnerHTML={{ __html: pageContent }}
      />
    </div>
  );
};

export default CustomHome;
