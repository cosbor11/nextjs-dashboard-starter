import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
});

const webAssetsHandler =  async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { filename, namespace } = req.query;

  if (typeof filename !== 'string') {
    return res.status(400).send('Filename must be a string');
  }

  const params = {
    Bucket: process.env.WEB_ASSETS_BUCKET,
    Key: `${namespace}/${filename}`,
  };

  try {
    const s3Response = await s3.send(new GetObjectCommand(params));
    const contentType = s3Response.ContentType;

    if (!contentType) {
      return res.status(400).send('Invalid content type');
    }

    res.setHeader('Content-Type', contentType);
    res.send(s3Response.Body);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching the image.');
  }
};

export default webAssetsHandler;
