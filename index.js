const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());






const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w3d5mtp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("agro_service").collection("service");

    const reviewCollection = client.db("agro_service").collection("reviews");

    //* create a document to insert

    app.post("/add/service", async (req, res) => {
      const addService = req.body;
      console.log(addService);
      const result = await serviceCollection.insertOne(addService);
      res.send(result);
    });

    //* create a document to insert review

    app.post("/review", async (req, res) => {
      const addReviews = req.body;
      console.log(addReviews);
      const result = await reviewCollection.insertOne(addReviews);
      res.send(result);
    });

    //* data read with limit

    app.get("/homeservices", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query).limit(3);
      const services = await cursor.toArray();
      res.send(services);
    });
    //* read all Data services
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    //* specific  data read services
    app.get("/servicedetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    //* read all Data reviews
    app.get("/showreview", async (req, res) => {
      const query = {};
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    //* read all Data for mY reviews
    app.get("/myreview", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewCollection.find(query);
      const myReviews = await cursor.toArray();
      res.send(myReviews);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("Agro Services server Running");
});

app.listen(port, () => {
  console.log(`Agro Services  running on port ${port}`);
});