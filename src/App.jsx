import { useState, useEffect } from "react";
//useState: Allows you to add state to functional components.
// useEffect: Lets you perform side effects in your components, such as data fetching.
import "@fortawesome/fontawesome-free/css/all.min.css";
//Imports Font Awesome icons for styling and adding icons to your application.


// import '/App.css';
function App() {

  //name: Stores the name of the transaction, including the price.
// datetime: Stores the date and time of the transaction.
// description: Stores a description of the transaction.
// transactions: Stores an array of transaction objects fetched from the backend.
// const apiUrl = import.meta.env.VITE_API_URL;: Retrieves the API URL from environment variables. This URL is used to make requests to the backend.
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  //useEffect: Runs the getTransactions function once when the component mounts (empty dependency array [] ensures this).
  //getTransactions().then(setTransactions): Fetches transactions from the API and updates the state with the fetched data.
  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

//getTransactions: Asynchronous function that fetches transactions from the backend.
// const url = ${apiUrl}/transaction;: Constructs the API URL.
// const response = await fetch(url);: Sends a GET request to the API.
// return await response.json();: Parses the JSON response and returns it.

  async function getTransactions() {
    const url = `${apiUrl}/transaction`;
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(e) {
    e.preventDefault();//Prevents the default form submission behavior, which would otherwise reload the page. This allows us to handle the form data using JavaScript.
    // Assuming these variables are coming from the component's state or props
    // const url = "http://localhost:4050/api/transaction";
    const url = `${apiUrl}/transaction`;//Constructs the API URL for posting the new transaction data.
    // Extract the price and name
    const [price, ...rest] = name.split(" ");
    const productName = rest.join(" ");
    //Sending the POST Request
    fetch(url, { //fetch(url, { ... }): Sends a fetch request to the API.
      method: "POST",
      headers: { "Content-Type": "application/json" },// Sets the Content-Type header to application/json to indicate that the request body contains JSON data.
      body: JSON.stringify({// Sets the Content-Type header to application/json to indicate that the request body contains JSON data.
        name: productName,
        price,
        description,
        datetime,
      }),
    })
    //Handling the Response
      .then((response) => response.json()) //Parses the JSON response from the server.
      .then((json) => { //json -> the parsed response object containing the newly created transaction data.
        // Format the datetime
        const formattedDateTime = new Intl.DateTimeFormat("en-US", {// Intl.DateTimeFormat :A JavaScript object for formatting dates.
          //en-US": Specifies the locale for formatting (English - United States).
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }).format(new Date(json.datetime)); //Converts the datetime string from the response into a JavaScript Date object.
        //.format(): Formats the date according to the specified options, such as including the year, month, day, and time.


        //Creates a new transaction object with the formatted date and other properties from the response.
        const newTransaction = {
          ...json,
          datetime: formattedDateTime,
        };
 
        
        setTransactions((prevTransactions) => [ //setTransactions: Updates the transactions state with the new transaction.
          ...prevTransactions, //prevTransactions: The previous state of the transactions array.
          newTransaction,
        ]); //[ ...prevTransactions, newTransaction ]: Creates a new array containing all previous transactions and the newly added transaction.

        //Clearing the inputs
        setName(""); // Clears the name input field.
        setDatetime(""); // Clears the datetime input field.
        setDescription("");
      })
      .catch((error) => {
        // console.error("Error:", error);
      });
  }

  //for setting dateandtime
  useEffect(() => {
    getTransactions().then((data) => {
      const formattedTransactions = data.map((transaction) => ({
        ...transaction,
        datetime: new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        }).format(new Date(transaction.datetime)),
      }));
      setTransactions(formattedTransactions);
    });
  }, []);

  function deleteTransaction(id) {//this function handles deleting a transaction by its unique identifier (id).
    const url = `${apiUrl}/transaction/${id}`;//Constructs the API URL for the DELETE request.
    fetch(url, { //Sends a fetch request to the API.
      method: "DELETE", //Specifies that this is a DELETE request to remove a resource on the server.
    })
    //Handling the Response
      .then((response) => {
        // Check if the response has content
        if (response.ok) { //Checks if the response status is OK (status code 200-299).
          return response.text().then(text => text ? JSON.parse(text) : null);//response.text(): Reads the response body as a text string.
          //text ? JSON.parse(text) : null: If the response text is not empty, parses it as JSON; otherwise, returns null.
        } else {
          throw new Error('Network response was not ok');//If the response status is not OK, throws an error.
        }
      })
      //.then(() => { ... }): Executes after successfully deleting the transaction.
      .then(() => {
        //setTransactions:Updates the transactions state by filtering out the deleted transaction.
        setTransactions((prevTransactions) => //prevTransactions: The previous state of the transactions array.
          prevTransactions.filter((transaction) => transaction._id !== id)//Returns a new array excluding the transaction with the specified ID.
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  
  let balance = 0;//initializes the balance.
  for (const transaction of transactions) {
    balance = balance + transaction.price;//Iterates through transactions and sums up the prices.
  }
  balance = balance.toFixed(2);// Formats the balance to two decimal places.

  return (
    <main>
      <h1>Welcome to Expense Tracker</h1>
      {/* -------BALANCE------------ */}
      <h3>BALANCE LEFT = {balance}</h3>
      {/* -------BALANCE------------ */}

      {/* -------Form------------ */}
      <form action="" onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={"price and name"}
          />
          <input
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            type="datetime-local"
          />
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={"description"}
          />
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      {/* -------Form------------ */}

      {/* --------Transactions------------ */}
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction, index) => (
            <div key={index} className="transaction">
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div
                  className={
                    "price " + (transaction.price < 0 ? "red" : "green")
                  }
                >
                  {transaction.price}
                </div>
                <div className="datetime">{transaction.datetime}</div>
                <i
                  className="fas fa-trash"
                  onClick={() => deleteTransaction(transaction._id)}
                  style={{
                    cursor: "pointer",
                    color: "red",
                    marginLeft: "10px",
                  }}
                ></i>
              </div>
            </div>
          ))}
      </div>
      {/* --------Transactions------------ */}
    </main>
  );
}

export default App;
// gWQY8kU9pxbjQ4X0
// mongodb+srv://poorvishrivastava17:gWQY8kU9pxbjQ4X0@cluster4.s82go29.mongodb.net/?retryWrites=true&w=majority&appName=Cluster4
 