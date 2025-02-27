import { useEffect, useState } from "react";
import AdminAuthWrapper from "../../utils/AdminAuthWrapper";
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
            console.log("Page content loaded successfully!");
          } else {
            console.error("Error loading home page:", response.data.error);
          }
        })
        .catch((error) => console.error("API request failed:", error));
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

export default AdminAuthWrapper(CustomHome);
