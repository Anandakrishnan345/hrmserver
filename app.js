
const express = require('express')
const app = express()
const cors = require('cors');
const connect = require("./db/config")
const authRoutes = require("./Routes/authRoutes");
const dotenv = require('dotenv');
dotenv.config()
app.use(cors());
app.use(authRoutes);

connect();
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})