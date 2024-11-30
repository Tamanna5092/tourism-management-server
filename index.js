const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

const corsOption = {
  origin: [
    "http://localhost:5173", "http://localhost:5174", "http://localhost:5175",
  ],
  credential: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOption));
app.use(express.json()) 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.abrfq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const touristsSpotCollection = client.db('tourismManagement').collection('touristsSpot')

    // get all country spots
    app.get('/touristsSpots', async(req, res) => {
        const result = await touristsSpotCollection.find().toArray()
        res.send(result)
    })

    // get single country spot
    app.get('/touristsSpot/:id', async(req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await touristsSpotCollection.findOne(query)
      res.send(result)
    })

    // save a single country spot in db
    app.post('/touristsSpot', async(req, res) => {
      const countryData = req.body
      const result = await touristsSpotCollection.insertOne(countryData)
      res.send(result)
    })

    // get all tourist spots added by specific user
    app.get('/touristsSpots/:email', async(req, res) => {
      const email = req.params.email
      const query = {'user.email': email}
      const result = await touristsSpotCollection.find(query).toArray()
      res.send(result)
    })

    // delete a tourist spot from db
    app.delete('/touristsSpot/:id', async(req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await touristsSpotCollection.deleteOne(query)
      res.send(result)
    })

    // Update a tourist spot from db
    app.put('/touristsSpot/:id', async(req, res) => {
      const id = req.params.id
      const touristData = req.body
      const query = { _id: new ObjectId(id) }
      const options = { upsert: true}
      const updateSpot = {
        $set: {
          ...touristData
        }
      }
      const result = await touristsSpotCollection.updateOne(query,updateSpot, options)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello from assignment 10')
})


app.listen(port, ()=> console.log(`Server running on port ${port}`))
