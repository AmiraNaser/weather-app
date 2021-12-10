// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express();
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
//require body-parser module
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
//require cors module
const cors = require('cors');
app.use(cors());
// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const port = 8000;
//listen to the port
const server = app.listen(port, () => {
  //callback function to confirm server is running
  console.log(`The server is running on localhost: ${port}`);
});

//make get request to return javascript object
app.get('/allData', (req, res) => {
  res.send(projectData);
})
//make post request to send data to the project endpoint(projectData)
//create an array to hold data
const data = [];
app.post('/addData', (req, res) => {
  projectData = req.body;
  console.log(projectData);
  data.push(projectData);
  console.log(data);
})
