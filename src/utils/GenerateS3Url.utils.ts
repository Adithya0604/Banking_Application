import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "dotenv/config";
import { s3client } from "../config/s3";
export const generateUrl = async (key: string, ContentType: string) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    ContentType: ContentType,
  });
  return await getSignedUrl(s3client, command, { expiresIn: 3500 });
};
