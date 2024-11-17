import express from "express";
import CustomersCtrl from "./customer_data.controller.js";
// import Bull from "bull";
// import dotenv from "dotenv";
// import { promisify } from "util";
// const sleep = promisify(setTimeout);
const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

import aws from "aws-sdk";
// Configure AWS SDK to use IAM role credentials automatically
aws.config.update({ region: "us-east-1" }); // Replace with your desired AWS region
// Create SQS service object
const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

const queueOptions = {
  redis: { host: REDIS_HOST, port: REDIS_PORT, password: REDIS_PASSWORD },
  limit: {
    max: 1,
    duration: 1000,
  },
};
// const jobQueue = new Bull("jobRequest_queue", queueOptions); // DEFINE QUEUE

const router = express.Router();
// router.route("/customer/:id").get(CustomersCtrl.apiGetCustomer);
router.route("/all").get(CustomersCtrl.apiGetAllCustomer);
// router.route("/new").post(CustomersCtrl.apiPostCustomer);
router.route("/gen_route").post(CustomersCtrl.apiPostGenRoute);
router
  .route("/customer/:id")
  .get(CustomersCtrl.apiGetCustomer)
  .put(CustomersCtrl.apiUpdateCustomer)
  .delete(CustomersCtrl.apiDeleteCustomer);

export default router;

// router.route("/new").post(async (req, res) => {
//   console.log("Adding job to queue: " + JSON.stringify(req.body));
//   try {
//     jobQueue.add({ jobData: req.body });
//     //console.log("req.body: " + JSON.stringify(req.body));
//     res.status(200).send({ success: true, message: "Job in queue !" });
//   } catch (err) {
//     res.status(200).send({ success: false });
//   }
// });

// jobQueue.process(function (job, done) {
//   console.log("Processing job " + JSON.stringify(job.data.jobData));
//   CustomersCtrl.apiPostCustomer(job.data.jobData);
//   done();
// });

// Send message to SQS
router.route("/new").post(async (req, res) => {
  console.log("Adding job to SQS: " + JSON.stringify(req.body));
  const { message } = req.body;
  const params = {
    MessageBody: message,
    QueueUrl: "https://sqs.us-east-1.amazonaws.com/471112517107/routeme_queue",
  };
  sqs.sendMessage(params, (err, data) => {
    if (err) {
      console.error("Error sending message to SQS:", err);
      res.status(500).send("Error sending message to SQS");
    } else {
      console.log("Message sent to SQS:", data.MessageId);
      res.redirect("/");
    }
  });
});

// In-memory storage for messages (to simulate an "in-progress" queue)
let messageQueue = [];

// Function to continuously poll SQS for messages
function pollSQS() {
  const params = {
    QueueUrl: "https://sqs.us-east-1.amazonaws.com/471112517107/routeme_queue", // Replace with your SQS queue URL
    AttributeNames: ["All"],
    MaxNumberOfMessages: 10, // Adjust as needed
    WaitTimeSeconds: 20, // Long polling for 20 seconds (you can adjust the value)
  };

  sqs.receiveMessage(params, (err, data) => {
    if (err) {
      console.error("Error receiving messages from SQS:", err);
    } else {
      const messages = data.Messages || [];
      if (messages.length > 0) {
        console.log(`Received ${messages.length} new messages.`);
        // Add messages to the in-memory queue
        messageQueue = messageQueue.concat(messages);

        // Optionally, you can delete the processed messages from SQS if necessary:
        messages.forEach((msg) => {
          const deleteParams = {
            QueueUrl: params.QueueUrl,
            ReceiptHandle: msg.ReceiptHandle,
          };
          sqs.deleteMessage(deleteParams, (err) => {
            if (err) {
              console.error("Error deleting message from SQS:", err);
            } else {
              console.log("Deleted message from SQS");
            }
          });
        });
      }
    }
  });
}

// Start polling SQS as soon as the server starts
setInterval(pollSQS, 2000); // Poll every 2 seconds (adjust as needed)
