import { NextApiRequest, NextApiResponse } from 'next';
import { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } from '@azure/storage-blob';

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  sasUrl: string;
  blobExists: boolean;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  if (req.method === 'GET') {
    const accountName = process.env.ACCOUNT_NAME;
    const accountKey = process.env.ACCOUNT_KEY;
    const containerName = process.env.CONTAINER_NAME;

    if (!accountName || !accountKey || !containerName) {
      return res.status(400).json({ error: 'Azure storage credentials are missing.' });
    }

    const { blobName } = req.query;
    if (!blobName || typeof blobName !== 'string') {
      return res.status(400).json({ error: 'blobName is required and must be a string.' });
    }

    try {
      const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
      const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential);

      const containerClient = blobServiceClient.getContainerClient(containerName);
      await containerClient.createIfNotExists();

      const blobClient = containerClient.getBlobClient(blobName);
      const blobExists = await blobClient.exists();

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const permissions = new BlobSASPermissions();
      permissions.read = true;
      permissions.write = true;

      const sasToken = generateBlobSASQueryParameters(
        {
          containerName,
          blobName: blobName as string,
          permissions,
          expiresOn: expiryDate,
        },
        sharedKeyCredential
      ).toString();

      const sasUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
      return res.status(200).json({ sasUrl: sasUrl, blobExists: blobExists });

    } catch (error) {
      console.error('Error generating SAS token:', error);
      return res.status(500).json({ error: 'Failed to generate SAS token.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
