import { S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";

const awsRegion = process.env.AWS_REGION;
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!awsRegion || !awsAccessKeyId || !awsSecretKey) {
  throw new Error("Missing S3 Important credentinals...");
}

export const s3client = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretKey,
  },
});
