const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

async function connect() {
    await mongoose.connect(MONGODB_URI)
        .then((message) => {
            console.log("Database connection established");
        })
        .catch((error) => {
            console.log("Database not connected : ", error);
        })
}

module.exports = connect;