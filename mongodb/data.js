import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

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
      console.log("adding " + name);
      return await customer_data.insertOne(customerDoc);
    } catch (e) {
      console.error(`Unable to post customer_addr: ${e}`);
      return { error: e };
    }
  }

  static async getCustomer(customerId) {
    try {
      return await customer_data.findOne({ _id: ObjectId(customerId) });
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

  static async updateCustomer(customerId, name, street_addr, city, state, zip) {
    try {
      const options = { upsert: true };
      const updateResponse = await customer_data.updateOne(
        //{ _id: ObjectId(customerId) },
        { customerId: parseInt(customerId) },
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

  static async deleteCustomer(customerId) {
    try {
      const query = { customerId: parseInt(customerId) };
      const deleteResponse = await customer_data.deleteOne(query);
      if (deleteResponse["deletedCount"]) {
        console.log("Successfully deleted " + deleteResponse["deletedCount"]);
      }
      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete customer: ${e}`);
      return { error: e };
    }
  }

  static async getCustomerById(customerId) {
    try {
      console.log("Getting customer by customerId");
      const cursor = await customer_data.find({
        customerId: parseInt(customerId),
      });
      return cursor.toArray();
    } catch (e) {
      console.error(`Unable to get customer: ${e}`);
      return { error: e };
    }
  }
}
