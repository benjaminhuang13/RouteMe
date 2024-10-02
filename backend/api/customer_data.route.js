import express from "express";
import CustomersCtrl from "./customer_data.controller.js";
// const sleep = promisify(setTimeout);
const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

const queueOptions = {
  redis: { host: REDIS_HOST, port: REDIS_PORT, password: REDIS_PASSWORD },
  limit: {
    max: 1,
    duration: 1000,
  },
};

const router = express.Router();
router.route("/all").get(CustomersCtrl.apiGetAllCustomer);
router.route("/new").post(CustomersCtrl.apiPostCustomer);
router.route("/gen_route").post(CustomersCtrl.apiPostGenRoute);
router
  .route("/customer/:id")
  .get(CustomersCtrl.apiGetCustomer)
  .put(CustomersCtrl.apiUpdateCustomer)
  .delete(CustomersCtrl.apiDeleteCustomer);

export default router;
