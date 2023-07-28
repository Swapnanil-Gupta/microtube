import dotenv from "dotenv";
import { Consumer } from "sqs-consumer";
import sqsClient from "./lib/sqsClient";
import messageHandler from "./messageHandler";

dotenv.config();

const app = Consumer.create({
  queueUrl: process.env.AWS_INCOMING_QUEUE_URL!,
  sqs: sqsClient,
  handleMessage: messageHandler,
});

app.on("message_received", () => {
  console.info("message received");
});

app.on("message_processed", () => {
  console.info("message processed");
});

app.on("error", (err) => {
  console.error(err.message);
});

app.on("processing_error", (err) => {
  console.error(err.message);
});

app.on("timeout_error", (err) => {
  console.error(err.message);
});

app.on("started", () => {
  console.info("service started listening for messages");
});

app.start();
