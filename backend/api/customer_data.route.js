import express from "express";
import CustomersCtrl from "./customer_data.controller.js";
import Bull from "bull";
import dotenv from "dotenv";
import { promisify } from "util";
// const sleep = promisify(setTimeout);
const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

const queueOptions = {
  redis: { host: REDIS_HOST, port: REDIS_PORT, password: REDIS_PASSWORD },
  limit: {
    max: 1,
    duration: 1000,
  },
};
const jobQueue = new Bull("jobRequest_queue", queueOptions); // DEFINE QUEUE

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

router.route("/new").post(async (req, res) => {
  console.log("Adding job to queue: " + JSON.stringify(req.body));
  try {
    jobQueue.add({ jobData: req.body });
    //console.log("req.body: " + JSON.stringify(req.body));
    res.status(200).send({ success: true, message: "Job in queue !" });
  } catch (err) {
    res.status(200).send({ success: false });
  }
});

jobQueue.process(function (job, done) {
  console.log("Processing job " + JSON.stringify(job.data.jobData));
  CustomersCtrl.apiPostCustomer(job.data.jobData);
  done();
});
