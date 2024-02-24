const mongoose = require ("mongoose");
const users = new mongoose.Schema(
    {
        
            email:"string",
            password:"string",
            phonenumber:"string",
            address:"string",
            pincode:"string"
        
    }
)
module.exports = mongoose.model("users",users);