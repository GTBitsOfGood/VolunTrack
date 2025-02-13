import { useState } from 'react';
import { useSession } from "next-auth/react";
import axios from 'axios';

function UploadFile() {
  const { data: session } = useSession();
  if (!session) return "unauthenticated";
  const user = session.user;

  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];

      // Check file extension
      const validExtensions = [".png"];
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
      if (fileExtension && validExtensions.includes(`.${fileExtension}`)) {
        setFile(selectedFile);
        setUploadError(null);
      } else {
        setUploadError("Please select a .png file.");
      }
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      console.error("no file selected");
      return;
    }

    try {
      const response = await axios.get(
        `/api/azure/sas_token?blobName=${encodeURIComponent(user._id)}`
      );
      const sasUrl = response.data.sasUrl;

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async () => {
        if (typeof reader.result === "string") {
          const base64File = reader.result.split(",")[1];

          const response = await axios.post("/api/azure/upload_file", {
            fileBuffer: base64File,
            sasUrl: sasUrl, 
          });

          console.log("Upload Response:", response.data);
        }
      };
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const fetchImageUrl = async () => {
    setLoading(true);
    setFetchError(null);
  
    try {
      // Request to backend to get SAS URL for the image
      const response = await axios.get(
        `/api/azure/sas_token?blobName=${encodeURIComponent(user._id)}`
      );
      const sasUrl = response.data.sasUrl;
      const blobExists = response.data.blobExists;
  
      if (blobExists) {
        setImageUrl(sasUrl); // Blob exists, set the image URL
      } else {
        setFetchError("no image uploaded, setting default");
        setImageUrl("/images/gradient-avatar.png");
      }
    } catch (error) {
      console.error("Error fetching image SAS URL", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h2>Image Upload</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload} disabled={!file}>
          Upload
        </button>
        {uploadError && <p style={{ color: "red" }}>{uploadError}</p>}
      </div>
      
      <div>
        <h2>Retrieve Image</h2>
        {fetchError && <p style={{ color: "red" }}>{fetchError}</p>}
        {imageUrl ? (
          <div>
            <img src={imageUrl} alt="Uploaded Image"/>
          </div>
        ) : (
          <p>No image available</p>
        )}
        <button onClick={fetchImageUrl} disabled={loading}>
          {loading ? "Loading..." : "Fetch Image"}
        </button>
      </div>
    </div>
  );
}

export default UploadFile;
