import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
import AWS from "aws-sdk";
const post_customer_sqs = new AWS.SQS({ region: "us-east-1" });
const del_customer_sqs = new AWS.SQS({ region: "us-east-1" });

let customer_data;

export default class CustomerDataDAO {
  static async injectDB(conn) {
    //parameter conn is connection from index.js file
    // static means we dont have to instantiate before calling function
    if (customer_data) {
      //if there is already a db connection, do nothing
      return;
    }
    try {
      // wait for db connection, get db called
      customer_data = await conn
        .db("customer_data")
        .collection("customer_data");
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  static async addCustomer(
    name,
    street_addr,
    city,
    state,
    zip,
    country,
    lat,
    long
  ) {
    try {
      console.log("Writing new customer to database");

      const customerDoc = {
        name: name,
        street_addr: street_addr,
        city: city,
        state: state,
        zip: zip,
        country: country,
        lat: lat,
        long: long,
      };
      // send to sqs
      const queueUrl =
        "https://sqs.us-east-1.amazonaws.com/471112517107/post_customer_queue";
      const params = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(customerDoc), // Send the data as a JSON string
      };
      console.log("json stringify query: " + JSON.stringify(customerDoc));

      const sqsResponse = await post_customer_sqs.sendMessage(params).promise();
      console.log("Message sent to post SQS:", sqsResponse);
      console.log("adding customer" + name);
      return { status: "success", messageId: sqsResponse.MessageId }; // Respond with success message
      //return await customer_data.insertOne(customerDoc);
    } catch (e) {
      console.error("Error sending message to post SQS:", e);
      //console.error(`Unable to post customer_addr: ${e}`);
      return { error: e };
    }
  }

  static async getCustomer(customerId) {
    try {
      return await customer_data.findOne({ _id: new ObjectId(customerId) });
    } catch (e) {
      console.error(`Unable to get customer: ${e}`);
      return { error: e };
    }
  }

  static async getAllCustomer() {
    try {
      console.log("Querying all Customers");
      return await customer_data.find({});
    } catch (e) {
      console.error(`Unable to get ALL customer: ${e}`);
      return { error: e };
    }
  }

  static async updateCustomer(
    customerObjId,
    name,
    street_addr,
    city,
    state,
    zip
  ) {
    try {
      const options = { upsert: true };
      const updateResponse = await customer_data.updateOne(
        { _id: new ObjectId(customerId) },
        {
          $set: {
            name: name,
            street_addr: street_addr,
            city: city,
            state: state,
            zip: zip,
          },
        }
      );
      return updateResponse;
    } catch (e) {
      console.error(`Unable to update customer: ${e}`);
      return { error: e };
    }
  }

  static async deleteCustomer(customerObjId) {
    try {
      const query = { _id: new ObjectId(customerObjId) };
      // send to sqs
      const del_queueUrl =
        "https://sqs.us-east-1.amazonaws.com/471112517107/delete_customer_queue";
      const params = {
        QueueUrl: del_queueUrl,
        MessageBody: JSON.stringify(query), // Send the data as a JSON string
      };
      console.log("json stringify query: " + JSON.stringify(query));
      const sqsResponse = await del_customer_sqs.sendMessage(params).promise();
      console.log("Message sent to delete SQS:", sqsResponse);
      console.log("deleting customer objID " + customerObjId);
      return { status: "success", messageId: sqsResponse.MessageId }; // Respond with success message
      // const deleteResponse = await customer_data.deleteOne(query);
      // if (deleteResponse["deletedCount"]) {
      //   console.log("Successfully deleted " + deleteResponse["deletedCount"]);
      // }
      // return deleteResponse;
    } catch (e) {
      console.error(`Unable to sending message to delete SQS: ${e}`);
      return { error: e };
    }
  }

  static async getCustomerById(customerObjId) {
    try {
      console.log("Getting customer by customerObjId " + Object(customerObjId));
      const cursor = await customer_data.find({
        _id: new ObjectId(customerObjId),
      });
      return cursor.toArray();
    } catch (e) {
      console.error(`Unable to get customer: ${e}`);
      return { error: e };
    }
  }
}
