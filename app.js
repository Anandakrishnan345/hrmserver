
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser'); 
const connect = require("./db/config");
const authRoutes = require("./Routes/authRoutes");
const dotenv = require('dotenv');

dotenv.config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(authRoutes);

connect();
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
