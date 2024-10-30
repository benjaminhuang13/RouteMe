import express from "express";
import cors from "cors";
import customer_data from "./api/customer_data.route.js";

const app = express(); //load express into
app.get("/health", (req, res) => {
  res.status(200).send("Health checked!");
  console.log("Health checked!");
});
app.use(cors()); //use middleware
app.use(express.json()); //allows server to accept json in a body of a request

app.use("/api/v1/customer_data", customer_data, (req, res) =>
  res.status(200).send("Routeme: /api/v1/customer_data")
); //url of the routes

app.use("/routeme-back/api/v1/customer_data", customer_data, (req, res) =>
  res.status(200).send("Routeme: /routeme-back/api/v1/customer_data")
); //url of the routes

app.use("backend.routeme3", customer_data, (req, res) =>
  res.status(200).send("Routeme: backend.routeme3")
); //url of the routes

app.use("backend.routeme3/api/v1/customer_data", customer_data, (req, res) =>
  res.status(200).send("Routeme: backend.routeme3")
); //url of the routes

app.use("/backend.routeme3", customer_data, (req, res) =>
  res.status(200).send("Routeme: /backend.routeme3")
); //url of the routes

app.use("/backend.routeme3/api/v1/customer_data", customer_data, (req, res) =>
  res.status(200).send("Routeme: /backend.routeme3/api/v1/customer_data")
); //url of the routes

app.use("*", (req, res) =>
  res.status(404).json({ error: "Routeme page not found sorry" })
); //backup route

export default app; //allows importing app
