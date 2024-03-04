// const mongoose= require("mongoose");

// const users=new mongoose.Schema(
//     {
//             name:"string",
//             email:"string",
//             phonenumber:"string",
//             Address:"string",
//             pincode:"string",
//             password:"string",
            
//     }
// )
// module.exports=mongoose.model("users",users);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true // removes whitespaces
        },
        email: {
            type: String,
            required: true,
            unique: true, // ensures email uniqueness
            trim: true,
            match: /^\S+@\S+\.\S+$/ // email format validation
        },
        phonenumber: {
            type: String,
            required: true,
            match: /^\d{10}$/ // validates a 10-digit phone number
        },
        Address: {
            type: String,
            required: true,
            trim: true
        },
        pincode: {
            type: String,
            required: true,
            trim: true,
            match: /^\d{6}$/ // validates a 6-digit pin code
        },
        password: {
            type: String,
            required: true,
            minLength: 6 // minimum password length
        }
    }
);

module.exports = mongoose.model("users", userSchema);
