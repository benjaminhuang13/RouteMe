import app from "./server.js";
import mongodb from "mongodb";
import CustomerDataDAO from "./dao/customerdataDAO.js";
import "dotenv/config";

const MongoClient = mongodb.MongoClient;
const mongo_username = process.env["MONGO_USERNAME"];
const mongo_password = process.env["MONGO_PASSWORD"];

const uri = `mongodb+srv://${mongo_username}:${mongo_password}@bargonzocluster.kh6ad.mongodb.net/?retryWrites=true&w=majority&appName=BargonzoCluster`;
const port = 8000;

MongoClient.connect(uri, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
  useNewUrlParser: true,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await CustomerDataDAO.injectDB(client); //sends database connect to DAO
    app.listen(port, () => {
      // passing port and nothing into arrow function
      console.log(`listening on port ${port}`);
    });
  });
