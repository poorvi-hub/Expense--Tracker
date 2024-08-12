const express = require("express");//Imports the Express library, which is a web framework for Node.js used to handle HTTP requests and set up the server.
const cors = require("cors");//Imports the cors middleware which allows you to enable Cross-Origin Resource Sharing. This is crucial for letting your frontend, which might be running on a different port or domain, access your backend.
require("dotenv").config();//Loads environment variables from a .env file, which is essential for managing sensitive data like database URLs.
const Transaction = require("./models/Transaction.js");//Imports the Transaction model which defines the schema for transactions in MongoDB. This model is used to interact with the transactions collection in the database.
const { default: mongoose } = require("mongoose");//Imports the mongoose library, which is an Object Data Modeling (ODM) library for MongoDB and Node.js. It helps in connecting to the MongoDB database and managing data.
const app = express();//Creates an instance of the Express application, which will be used to set up routes and middleware.

const url = "/api/test";
const port = 4050;
const message = "test ok";

//middlewares
app.use(cors());
//Applies the cors middleware to your application, which allows your API to accept requests from different origins. This is important for frontend applications running on a different port or domain.
app.use(express.json());
//This middleware parses incoming requests with JSON payloads and makes the resulting data available in req.body. It is necessary for handling JSON data sent in POST and PUT requests.

//Provides a simple endpoint to test if the server is running correctly.
app.get(url, (req, res) => {
  res.json(message);
});

app.post("/api/transaction", async (req, res) => {//Defines a route for HTTP POST requests to /api/transaction. This route is used to create a new transaction.
      try {
        console.log("Connecting to MongoDB database...");
        //Connects to MongoDB using the connection string from the .env file. It should be placed outside the route handler in a production application to avoid reconnecting with every request.
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB database connected successfully!");
    
        // Check if all required fields are present in the request body
        if (
          !req.body.name ||
          !req.body.description ||
          !req.body.datetime ||
          !req.body.price
        ) {
          res.status(400).send("Missing required fields");
          return;
        }
    
        // Create a new transaction with the data from the request body
        const { name, description, datetime, price } = req.body;
        const transaction = await Transaction.create({
          //Creates a new transaction document in the MongoDB collection using the data from req.body.
          name,
          description,
          datetime,
          price,
        });
    
        res.json(transaction);//Sends the newly created transaction as a JSON response
      } catch (error) {
        console.error("Error connecting to MongoDB database:", error);
        res.status(500).send("Internal Server Error");
      }
});
    
//Connects to MongoDB and retrieves all transactions from the database.
app.get("/api/transaction", async (req, res) => {
  //Defines a route for HTTP GET requests to /api/transaction. This route retrieves all transactions from the database.
  await mongoose.connect(process.env.MONGO_URL);
  const transactions = await Transaction.find();//Fetches all transaction documents from the MongoDB collection.
  res.json(transactions);//Sends the list of transactions as a JSON response.
});

app.delete("/api/transaction/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Transaction.findByIdAndDelete(id);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

//starts the server and listens on the specified port (4050).
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
 });

// // Static Port
// app.listen(port);
// console.log(`App listening on port http://localhost:${port}${url}`);

// // // Dynamic Port
// // const server = app.listen(0, () => {
// //   const port = server.address().port;
// //   console.log(`App listening on port http://localhost:${port}${url}`);
// // });

 // Note: to run the program run nodemon index.js