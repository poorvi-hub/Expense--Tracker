const mongoose = require("mongoose");//Imports the Mongoose library, which is used for interacting with MongoDB and managing data schemas.
const { Schema, model } = mongoose;//const { Schema, model } = mongoose;: Destructures Schema and model from Mongoose.
//Schema: This is used to define the structure of documents in a MongoDB collection.
//model: This is used to create a Mongoose model, which is a constructor function that allows you to interact with a specific collection in the database.

//Creates a new Mongoose schema for the Transaction model. This schema defines the structure and constraints for documents in the Transaction collection.
const TransactionSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  datetime: { type: Date, required: true },
});
//Creates a Mongoose model named Transaction based on the TransactionSchema. This model allows you to interact with the Transaction collection in MongoDB:
const TransactionModel = model("Transaction", TransactionSchema);
//Transaction": The name of the model. This name is used to refer to the collection in MongoDB, which will be transactions (Mongoose automatically pluralizes model names to determine the collection name).
// TransactionSchema: The schema that defines the structure of documents in the collection.

module.exports = TransactionModel;