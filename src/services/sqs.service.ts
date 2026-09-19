import { SendMessageCommand, SQS, SQSClient } from "@aws-sdk/client-sqs";
import "dotenv/config";

const sqsConnection = new SQSClient({ region: process.env.AWS_REGION });

export async function sendtoSqs(input: any) {
  const command = new SendMessageCommand({
    QueueUrl: process.env.SQSQueueUrl,
    MessageBody: JSON.stringify(input),
    MessageGroupId: input.customer_id,
  });

  return await sqsConnection.send(command);
}
