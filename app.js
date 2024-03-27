const dotenv=require('dotenv');
dotenv.config();
const express = require('express');
const app = express();

const cors = require("cors");
const authRoutes = require('./Routes/authRoutes');
const userRoutes=require('./Routes/userroutes');
const connect = require("./db/models/config");

dotenv.config();

// Connect to the database
connect();

// Enable CORS for specific origin
// const corsOptions = {
//   origin: 'http://localhost:5173' // Allow requests from this origin
// };

// app.use(cors(corsOptions));

app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Mount authentication routes
app.use(authRoutes);
app.use(userRoutes);

// Serve static files
console.log("__dirname", __dirname);
app.use('/', express.static(__dirname + "/hrmclient"));

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`server listening at http://localhost:${process.env.PORT}`);
})
