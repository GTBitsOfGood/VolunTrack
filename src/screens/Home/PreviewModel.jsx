import { useEffect } from "react";
import "react-quill/dist/quill.bubble.css";
import ReactQuill from "react-quill";

const PreviewModel = ({ pageContent, onClose }) => {
  useEffect(() => {
    console.log("Preview content:", pageContent);
  }, [pageContent]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg">
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
