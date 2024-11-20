import CustomerDataDAO from "../data.js"; 

import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

import CustomerDataDAO from CustomerDataDAO

const Consumer = require("sqs-consumer");

const app = Consumer.create({
  queueUrl: "https://sqs.eu-west-1.amazonaws.com/471112517107/proj1_db_mngr",
  handleMessage: (message, done) => {
    console.log("Processing message: ", message);
     if (message.api=='get') {
        let id = parseInt(message.id) || {};
        let customer =  CustomerDataDAO.getCustomerById(id);
        if (!customer) {
          res.status(404).json({ error: "Not found" });
          return;
        }
        res.json(customer);
    } else if (message.api=='post') {
        const customerId = parseInt(message.zip);
        const name = message.name;
        const street_addr = message.street_addr;
        const city = message.city;
        const state = message.state;
        const zip = message.zip;
        const country = message.country;
        const lat = message.lat;
        const long = message.long;
  
        const customerResponse = CustomerDataDAO.addCustomer(
          customerId,
          name,
          street_addr,
          city,
          state,
          zip,
          country,
          lat,
          long
        );
        console.log({ status: "success" });
    } else if (message.api=='update') {
        console.log("apiUpdateCustomer called");
        const customerId = message.customerId;
        const name = message.name;
        const street_addr = message.street_addr;
        const city = message.city;
        const state = message.state;
        const zip = message.zip;
        const customerResponse = CustomerDataDAO.updateCustomer(
        customerId,
        name,
        street_addr,
        city,
        state,
        zip
      );
    } else if (message.api=='delete') {
        customerId = message.id;
        console.log("Trying to delete " + customerId);
        customerResponse = CustomerDataDAO.deleteCustomer(customerId);
      res.json({ status: "success" });
    } else {
        console.log("API unrecognized: ", message.api);
    }
    done();
  },
});

app.on("error", (err) => {
  console.log(err.message);
});

app.start();
