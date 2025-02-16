import { useEffect } from "react";
import "react-quill/dist/quill.bubble.css";
import ReactQuill from "react-quill";

const PreviewModel = ({ pageContent, onClose }) => {
  useEffect(() => {
    console.log("Preview content:", pageContent);
  }, [pageContent]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-lg font-bold mb-4">Preview</h2>
        <ReactQuill
          value={pageContent}
          readOnly={true}
          theme="bubble"
        />
        <button
          className="mt-4 px-4 py-2 bg-primaryColor text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PreviewModel;

