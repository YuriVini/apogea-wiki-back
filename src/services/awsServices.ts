import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { s3Client } from "../lib/aws";
import { BadRequestError } from "../http/routes/_errors/bad-request";

export const PREFIX_URL = "https://apogeawikipublic.s3.us-east-2.amazonaws.com";

export const uploadSignedUrlHandler = async (fileName: string) => {
  try {
    const command = new PutObjectCommand({
      Key: fileName,
      Bucket: process.env.AWS_BUCKET_NAME,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 60,
    });

    return { signedUrl };
  } catch (error) {
    throw new BadRequestError("Failed to generate presigned URL");
  }
};
