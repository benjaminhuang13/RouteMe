import express from "express";
import cors from "cors";
import customer_data from "./api/customer_data.route.js";

const app = express(); //load express into

app.use(cors()); //use middleware
app.use(express.json()); //allows server to accept json in a body of a request

app.use("/api/v1/customer_data", customer_data); //url of the routes
app.use("*", (req, res) =>
  res.status(404).json({ error: "Routeme not found sorry" })
); //backup route

router.get("/health", (req, res) => {
  res.status(200).send("Ok");
});

export default app; //allows importing app
