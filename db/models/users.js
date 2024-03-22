// const mongoose= require("mongoose");

// const users=new mongoose.Schema(
//     {
//             name:"string",
//             email:"string",
//             phonenumber:"string",
//             Address:"string",
//             pincode:"string",
//             password:"string",
//             user_type: { type: mongoose.Schema.Types.ObjectId, ref: "user_types" },
            
//     }
// )
// module.exports=mongoose.model("users",users);
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true, // removes whitespaces
            validate: {
                validator: function (value) {
                    // Check if the name is between 3 and 30 characters
                    if (value.length < 3 || value.length > 30) {
                        return false;
                    }
        
                    // Check if the name contains only alphabets
                    return !/[^A-Za-z]/.test(value);
                },
                message: '3 and 30 characters,no numbers or special characters'
            }
        },
        
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: {
                validator: function(value) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message: 'Invalid email format'
            }
        },
        
        phonenumber: {
            type: String,
            required: true,
            validate: {
                validator: function(value) {
                    return /^\d{10}$/.test(value);
                },
                message: 'Phone number must be a 10-digit number'
            }
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
            match: /^[0-9]{6}$/ // validates a 6-digit pin code with only numeric characters
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            
        },
            user_type: { type: mongoose.Schema.Types.ObjectId, ref: "user_types" },
            password_token: "string",
            lastLogin:{type:Date,default:null},
    }
);

module.exports = mongoose.model("users", userSchema);
