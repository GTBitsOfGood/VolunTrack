import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import BoGButton from "../../components/BoGButton";
import AdminAuthWrapper from "../../utils/AdminAuthWrapper";
import { Toast, ToggleSwitch } from "flowbite-react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import ResizeModule from "@ssumo/quill-resize-module";
import { EyeIcon } from "@heroicons/react/24/outline";
import PreviewModel from "./previewModel";

const VolunterHome = () => {
  let ReactQuill;
  // patch for build failure
  if (typeof window !== "undefined") {
    ReactQuill = require("react-quill");
    ReactQuill.Quill.register("modules/resize", ResizeModule);
  }
  const quill = useRef(null);

  const {
    data: { user },
  } = useSession();

  const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }, { font: [] }],[],[],[],[],[],[],
    [
      { color: [] },
      "italic",
      "bold",
      { align: "" },
      { align: "center" },
      { align: "right" },
      "image",
      'video'
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

  const loadPage = async () => {
    // Implement backend call to fetch volunteer home page here.
  };

  useEffect(() => {
    loadPage();
  }, []);

  const submitPage = () => {
    console.log(pageContent);
    // Implement backend call to save volunteer home page here.
  };

  const handlePreviewClick = () => {
    setShowPreview(true); // Show the preview modal
  };

  const handleClosePreview = () => {
    setShowPreview(false); // Close the preview modal
  };

  return (
    <div className="flex-column mx-1 my-2 flex rounded-sm p-4 gap-8">
      <div>
        <div className="flex items-start gap-4">
          <h2 className="text-lg font-bold">Volunteer Home</h2>
          <ToggleSwitch
            onChange={() => setEdit(!edit)}
            checked={edit}
            theme={customTheme}
            color={"primary"}
          />
        </div>
        <div className="flex items-start justify-between">
          <p className="m-0 text-sm font-medium text-gray-900 dark:text-gray-300 mb-1 h-6 font-medium text-slate-600">
            Design the Home page for volunteers
          </p>
          { edit && (
            <div className="flex items-start gap-4 cursor-pointer" onClick={handlePreviewClick}>
            <EyeIcon style={{ color: "#0183A1" }} className="w-6 h-6 text-gray-500" />
            <p style={{ color: "#0183A1" }} className="cursor-pointer">Preview</p>
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
            <div className="pl-2 text-sm font-normal">Minor waiver saved successfully!</div>
            <Toast.Toggle />
          </Toast>
        </div>
      )}
      {edit && (
        <>
          <div className="mb-4 bg-white">
            <ReactQuill
              className="bg-white h-auto"
              value={pageContent}
              modules={{ toolbar: TOOLBAR_OPTIONS, resize: {} }}
              onChange={(newValue) => {
                setPageContent(newValue);
              }}
              ref={quill}
            />
          </div>
          <div className="flex justify-end">
            <BoGButton onClick={submitPage} text="Save" />
          </div>
        </>
      )}
      {showPreview && <PreviewModel pageContent={pageContent} onClose={handleClosePreview} />} {/* Pass pageContent and onClose as props */}
    </div>
  );
};

export default AdminAuthWrapper(VolunterHome);