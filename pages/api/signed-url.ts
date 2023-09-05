import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({ region: 'us-west-2' });

const signedUrlHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { fileName, fileType, namespace } = req.query;

  if (!fileName || !fileType || typeof fileName !== 'string' || typeof fileType !== 'string') {
    return res.status(400).send('Missing or incorrect fileName or fileType');
  }

  const fileExtension = fileType.split('/')[1] ? `.${fileType.split('/')[1]}` : '';
  const key = `${namespace}/${uuidv4()}${fileExtension}`;

  const params = {
    Bucket: process.env.WEB_ASSETS_BUCKET,
    Key: key,
    ContentType: fileType
  };

  // Create a pre-signed URL
  try {
    const command = new PutObjectCommand(params);
    const presignedURL = await getSignedUrl(s3, command, { expiresIn: 900 }); //15 min expiration
    console.log(`presignedURL ${presignedURL}`);
    let response = {
      "signedUrl": presignedURL,
      "key": key,
    };
    res.send(response);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating signed URL');
  }
};

export default signedUrlHandler
