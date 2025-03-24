import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import BoGButton from "../../components/BoGButton";
import AdminAuthWrapper from "../../utils/AdminAuthWrapper";
import { Toast, ToggleSwitch } from "flowbite-react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { EyeIcon } from "@heroicons/react/24/outline";
import {
  loadPage,
  submitPage,
  getAboutPageToggle,
  setAboutPageToggle,
} from "../../queries/organizations";
import PreviewModel from "./PreviewModel";
import dynamic from "next/dynamic";
import DOMPurify from "dompurify";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const VolunterHome = () => {
  const quillRef = useRef(null);
  const [quill, setQuillModules] = useState({});

  // Look into fix
  useEffect(() => {
    if (typeof window !== "undefined") {
      Promise.all([
        import("quill"),
        import("@ssumo/quill-resize-module").catch(() => null), // Handle errors gracefully
      ]).then(([QuillModule, ResizeModule]) => {
        const Quill = QuillModule.default || QuillModule;

        // Ensure ResizeModule is valid before registering
        if (ResizeModule && ResizeModule.default) {
          Quill.register("modules/resize", ResizeModule.default);
        }

        setQuillModules({
          toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
          ],
          resize: {}, // Activate the resize module
        });
      });
    }
  }, [pageContent]);

  const {
    data: { user },
  } = useSession();

  const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [
      { color: [] },
      "italic",
      "bold",
      { align: "" },
      { align: "center" },
      { align: "right" },
      "image",
      "video",
    ],
  ];

  const customTheme = {
    toggle: {
      checked: {
        color: {
          primary: "bg-primaryColor",
        },
      },
    },
  };

  const [pageContent, setPageContent] = useState("");
  const [Saved, setSaved] = useState(false);
  const [edit, setEdit] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // State to control the preview modal
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
            setEdit(response.data.aboutPageToggle);
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

  const handleSubmitPage = async () => {
    if (!session?.user?.organizationId) {
      console.error("Missing session data or organization ID.");
      return;
    }

    try {
      const response = await submitPage(
        session.user.organizationId.toString(),
        pageContent
      );

      if (response.data.message) {
        console.log("Successfully updating page");
        setSaved(true);
      } else {
        console.error("Error updating page:", String(response.data.error));
      }
    } catch (error) {
      console.error("API request error:", String(error));
    }
  };

  const handleToggleChange = async () => {
    if (session?.user?.organizationId) {
      try {
        const response = await setAboutPageToggle(
          session.user.organizationId.toString(),
          !edit
        );
        if (response.data.message) {
          console.log("Successfully updated aboutPageToggle");
        } else {
          console.error("Error updating aboutPageToggle:", response.data.error);
        }
      } catch (error) {
        console.error("API request error:", String(error));
      }
    }
    setEdit(!edit);
  };

  const handlePreviewClick = () => {
    setShowPreview(true); // Show the preview modal
  };

  const handleClosePreview = () => {
    setShowPreview(false); // Close the preview modal
  };

  return (
    <div className="flex-column mx-1 my-2 flex gap-8 rounded-sm p-4">
      <div>
        <div className="flex items-start gap-4">
          <h2 className="text-lg font-bold">About Page</h2>
          <ToggleSwitch
            onChange={handleToggleChange}
            checked={edit}
            theme={customTheme}
            color={"primary"}
          />
        </div>
        <div className="flex items-start justify-between">
          <p className="m-0 mb-1 h-6 text-sm font-medium font-medium text-gray-900 text-slate-600 dark:text-gray-300">
            Design an About page for your volunteers
          </p>
          {edit && (
            <div
              className="flex cursor-pointer items-start gap-2"
              onClick={handlePreviewClick}
            >
              <EyeIcon className="h-6 w-6 text-gray-500 text-primaryColor" />
              <p className="cursor-pointer text-primaryColor">Preview</p>
            </div>
          )}
        </div>
      </div>
      {Saved && (
        <div className="pb-3">
          <Toast>
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
              <CheckCircleIcon className="h-5 w-5" />
            </div>
            <div className="pl-2 text-sm font-normal">
              Home Page Saved Successfully!
            </div>
            <Toast.Toggle />
          </Toast>
        </div>
      )}
      {edit && (
        <>
          <div className="mb-4 bg-white">
            <ReactQuill
              className="h-auto bg-white"
              value={pageContent}
              modules={{ toolbar: TOOLBAR_OPTIONS, resize: {} }}
              onChange={(newValue) => {
                setPageContent(newValue);
              }}
              ref={quill}
            />
          </div>
          <div className="flex justify-end">
            <BoGButton onClick={handleSubmitPage} text="Save" />
          </div>
        </>
      )}
      {showPreview && (
        <PreviewModel pageContent={pageContent} onClose={handleClosePreview} />
      )}{" "}
      {/* Pass pageContent and onClose as props */}
    </div>
  );
};

export default AdminAuthWrapper(VolunterHome);
