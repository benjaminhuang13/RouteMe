import AWS from "aws-sdk";
const mongodb_sqs = new AWS.SQS({ region: "us-east-1" });

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
    customerId,
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
      const message = {
        api: post,
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
        "https://sqs.us-east-1.amazonaws.com/471112517107/proj1_db_mngr";
      const params = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(message), // Send the data as a JSON string
      };
      console.log("json stringify query: " + JSON.stringify(message));

      const sqsResponse = await post_customer_sqs.sendMessage(params).promise();
      console.log("Message sent to post SQS:", sqsResponse);
      console.log("adding customer" + name);
      return { status: "success", messageId: sqsResponse.MessageId }; // Respond with success message
    } catch (e) {
      console.error(`Unable to post customer_addr: ${e}`);
      return { error: e };
    }
  }

  static async getCustomer(customerId) {
    try {
      const message = {
        api: get,
        customerId: customerId,
      };
      // send to sqs
      const queueUrl =
        "https://sqs.us-east-1.amazonaws.com/471112517107/proj1_db_mngr";
      const params = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(message), // Send the data as a JSON string
      };
      console.log("json stringify query: " + JSON.stringify(message));
      const sqsResponse = await post_customer_sqs.sendMessage(params).promise();
      return { status: "success", messageId: sqsResponse.MessageId }; // Respond with success message
    } catch (e) {
      console.error(`Unable to get customer: ${e}`);
      return { error: e };
    }
  }

  static async getAllCustomer() {
    try {
      const message = {
        api: getall,
        customerId: customerId,
      };
      // send to sqs
      const queueUrl =
        "https://sqs.us-east-1.amazonaws.com/471112517107/proj1_db_mngr";
      const params = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(message), // Send the data as a JSON string
      };
      return { status: "success", messageId: sqsResponse.MessageId }; // Respond with success message
    } catch (e) {
      console.error(`Unable to get ALL customer: ${e}`);
      return { error: e };
    }
  }

  static async updateCustomer(customerId, name, street_addr, city, state, zip) {
    try {
      const message = {
        api: update,
        customerId: parseInt(customerId),
        $set: {
          name: name,
          street_addr: street_addr,
          city: city,
          state: state,
          zip: zip,
        },
      };
      // send to sqs
      const queueUrl =
        "https://sqs.us-east-1.amazonaws.com/471112517107/proj1_db_mngr";
      const params = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(message), // Send the data as a JSON string
      };
      return { status: "success", messageId: sqsResponse.MessageId }; // Respond with success message
    } catch (e) {
      console.error(`Unable to update customer: ${e}`);
      return { error: e };
    }
  }

  static async deleteCustomer(customerId) {
    try {
      const message = {
        api: "delete",
        customerId: parseInt(customerId),
      };
      // send to sqs
      const queueUrl =
        "https://sqs.us-east-1.amazonaws.com/471112517107/proj1_db_mngr";
      const params = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(message), // Send the data as a JSON string
      };
      return { status: "success", messageId: sqsResponse.MessageId }; // Respond with success message
    } catch (e) {
      console.error(`Unable to delete customer: ${e}`);
      return { error: e };
    }
  }

  static async getCustomerById(customerId) {
    try {
      console.log("Getting customer by customerId");
      const message = {
        api: getId,
        customerId: parseInt(customerId),
      };
      // send to sqs
      const queueUrl =
        "https://sqs.us-east-1.amazonaws.com/471112517107/proj1_db_mngr";
      const params = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(message), // Send the data as a JSON string
      };
      return { status: "success", messageId: sqsResponse.MessageId }; // Respond with success message
    } catch (e) {
      console.error(`Unable to get customer: ${e}`);
      return { error: e };
    }
  }
}
