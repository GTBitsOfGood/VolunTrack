import { useEffect, useRef } from "react";
import "react-quill/dist/quill.snow.css";

const PreviewModel = ({ pageContent, onClose }) => {
  useEffect(() => {
    // console.log("Preview content:", pageContent);
  }, [pageContent]);

  let ReactQuill;
  // patch for build failure
  if (typeof window !== "undefined") {
    ReactQuill = require("react-quill");
  }
  const quill = useRef(null);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-4 shadow-lg">
        <h2 className="mb-4 text-lg font-bold">Preview</h2>
        <ReactQuill value={pageContent} readOnly={true} theme="bubble" />
        <button
          className="mt-4 rounded bg-primaryColor px-4 py-2 text-white"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PreviewModel;
