import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION,
});

async function sendMessage(payload: any) {
  try {
    const command = new SendMessageCommand({
      QueueUrl: process.env.AWS_OUTGOING_QUEUE_URL,
      MessageBody: JSON.stringify(payload),
    });
    const { MessageId } = await sqsClient.send(command);
    return MessageId;
  } catch (err) {
    throw err;
  }
}

export default sqsClient;
export { sendMessage };
