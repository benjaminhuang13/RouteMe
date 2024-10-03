import CustomerDataDAO from "../dao/customerdataDAO.js"; //get info from ther oute and sends it to DAO
import "dotenv/config";
import routing from "@googlemaps/routing";
import { GoogleAuth } from "google-auth-library";

let geocoder;
const start_location_lat = 40.758116;
const start_location_long = -73.831308;

export default class CustomersCtrl {
  // apiPostCustomer function not compatible with queue
  static async apiPostCustomer(req, res, next) {
    // static because you can call it directly from controller
    console.log("apiPostCustomer called: " + req);
    try {
      const name = req.body.name;
      const street_addr = req.body.street_addr;
      const city = req.body.city;
      const state = req.body.state;
      const zip = req.body.zip;
      const country = req.body.country;
      const lat = req.body.lat;
      const long = req.body.long;

      //console.log("customerId: " + customerId);
      const customerResponse = await CustomerDataDAO.addCustomer(
        name,
        street_addr,
        city,
        state,
        zip,
        country,
        lat,
        long
      );
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetCustomer(req, res, next) {
    try {
      console.log("apiGetCustomer " + req.params.id);
      let objId = req.params.id || {};
      let customer = await CustomerDataDAO.getCustomerById(objId);
      if (!customer) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.json(customer);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiUpdateCustomer(req, res, next) {
    try {
      console.log("apiUpdateCustomer called");
      const customerObjId = req.body.customerObjId;
      const name = req.body.name;
      const street_addr = req.body.street_addr;
      const city = req.body.city;
      const state = req.body.state;
      const zip = req.body.zip;
      //const country = req.body.country;
      const customerResponse = await CustomerDataDAO.updateCustomer(
        customerObjId,
        name,
        street_addr,
        city,
        state,
        zip
      );
      var { error } = customerResponse;
      if (error) {
        res.status(400).json({ error });
      }

      if (customerResponse.modifiedCount === 0) {
        throw new Error("unable to update customer");
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  // Note: uses object ID
  // static async apiDeleteCustomer(req, res, next) {
  //   try {
  //     const customer_obj_Id = req.params.id;
  //     console.log("Trying to delete " + customer_obj_Id);
  //     const customerResponse = await CustomerDataDAO.deleteCustomer(
  //       customer_obj_Id
  //     );
  //     res.json({ status: "success" });
  //   } catch (e) {
  //     res.status(500).json({ error: e.message });
  //   }
  // }

  static async apiDeleteCustomer(req, res, next) {
    try {
      const customerObjId = req.params.id;
      console.log("Trying to delete " + customerObjId);
      const customerResponse = await CustomerDataDAO.deleteCustomer(
        customerObjId
      );
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetAllCustomer(req, res, next) {
    try {
      let list = [];
      let customer_cursor = await CustomerDataDAO.getAllCustomer();
      if (!customer_cursor) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      for await (const doc of customer_cursor) {
        //iterates through list of find results and pushes to a list and sends the list as a response
        list.push(doc);
      }
      res.json(list);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiPostGenRoute(req, res, next) {
    console.log("Generating Route API called");
    const list_of_intermediates = req.body;
    console.log("intermediates: " + JSON.stringify(list_of_intermediates));
    try {
      const response = await callComputeRoutes(list_of_intermediates);
      res.json(response);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }
}

const routingClient = new routing.v2.RoutesClient({
  authClient: new GoogleAuth().fromAPIKey(process.env.GOOGLE_MAPS_API_KEY),
});

async function callComputeRoutes(list_of_intermediates) {
  // Run request https://stackoverflow.com/questions/76858652/node-js-google-routes-library-field-mask
  //https://developers.google.com/maps/documentation/routes/reference/rest/v2/TopLevel/computeRoutes
  const response = await routingClient.computeRoutes(
    {
      origin: {
        location: {
          latLng: {
            latitude: start_location_lat,
            longitude: start_location_long,
          },
        },
      },
      destination: {
        location: {
          latLng: {
            latitude: start_location_lat,
            longitude: start_location_long,
          },
        },
      },
      intermediates: list_of_intermediates,
      optimizeWaypointOrder: true,
    },
    {
      otherArgs: {
        headers: {
          "X-Goog-FieldMask": "*",
        },
      },
    }
  );
  console.log("ROUTE RESULTS Legs: " + JSON.stringify(response.length));

  return response;
}
