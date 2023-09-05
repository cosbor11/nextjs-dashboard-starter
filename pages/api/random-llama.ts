import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getBasePath } from '@/src/request-helpers';


const s3 = new S3Client({ region: process.env.AWS_DEFAULT_REGION });

const randomLlamaHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const baseUrl = getBasePath(req)
  let key = await getRandomLlamaImageFromS3();
  res.status(200).json({ url: `${baseUrl}/api/web-assets/${key}` });
};

async function getRandomLlamaImageFromS3(): Promise<string> {
  const bucketName = process.env.WEB_ASSETS_BUCKET;
  const llamaPicFolder = 'llama-pics';

  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: llamaPicFolder,
  });

  const objects = await s3.send(command);

  if (objects.Contents?.length === 0) {
    return getRandomLlamaImageFromUnsplash();
  }

  if (objects?.Contents?.length) {
    const randomIndex = Math.floor(Math.random() * objects.Contents.length);
    const key = objects.Contents[randomIndex]?.Key as string;
    return key
  }
  
  return "";
}

async function getRandomLlamaImageFromUnsplash() {
  const query = 'llama';
  const safeQuery = encodeURIComponent(query);
  const unsplashURL = `https://api.unsplash.com/photos/random?query=${safeQuery}`;

  const headers = {
    Authorization: `Client-ID ${process.env.UNSPLASH_API_KEY}`,
  };

  try {
    console.log(`API: getting random llama from unsplash...`);
    const response = await fetch(unsplashURL, { headers });
    const data = await response.json();
    const imageUrl = data.urls.small as string;

    console.log(`successfully got a random llama from unsplash!: ${imageUrl}`);
    return imageUrl
  } catch(error){
    console.log("failed to get llama image from unsplash", error)
    return ''
  }
  
}

export default randomLlamaHandler

