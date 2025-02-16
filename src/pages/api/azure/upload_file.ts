import { NextApiRequest, NextApiResponse } from "next";
import { BlockBlobClient } from "@azure/storage-blob";

type UploadRequestBody = {
  fileBuffer: string;
  sasUrl: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { fileBuffer, sasUrl }: UploadRequestBody = req.body;

      if (!fileBuffer || !sasUrl) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const blobClient = new BlockBlobClient(sasUrl);
      const buffer = Buffer.from(fileBuffer, "base64");
      await blobClient.uploadData(buffer, {
        blobHTTPHeaders: {
          blobContentType: "image/png",
        },
      });

      return res.status(200).json({ message: "File uploaded successfully" });
    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ error: "Failed to upload file" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
