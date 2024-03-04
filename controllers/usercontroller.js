const users=require('../db/models/users');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const { response } = require('express');
const success_function=require('../Utils/response-handler').success_function;
const error_function=require('../Utils/response-handler').error_function;


exports.addUser=async function(req,res){

    try {
        
        const name=req.body.name;
        const email=req.body.email;
        const password=req.body.password;
        const phonenumber=req.body.phonenumber;
        const Address=req.body.Address;
        const pincode =req.body.pincode;

        const isUserExist =await users.findOne({email});
        console.log("isUserExist : ",isUserExist);

        if(isUserExist){
          let  response=error_function({
            statusCode:400,
           message:('User Already Exixts')
          });
          console.log("response is ",response)
          res.status(response.statusCode).send(response);
            return;  
        }

        let salt=await bcrypt.genSalt(10);
        console.log("salt : ",salt);

        let hashed_password=bcrypt.hashSync(password,salt);
        console.log("hashed_password : ",hashed_password);

        const new_user=await users.create({
            name,
            email,
            password:hashed_password,
            phonenumber,
            Address,
            pincode
        });
        let response_obj={
           name,
           email,
           password,
           phonenumber,
           Address,
           pincode
        }

        if(new_user){
            let response=success_function({
                statusCode:201,
                data:new_user,
                message:"success"
            });
            res.status(response.statusCode).send(response)
            return;
        }else{
            response=error_function({
                statusCode:400,
                message:"failed"
            });
            res.status(response.statusCode).send(response)
            return
        }
    } catch (error) {
        let response=error_function({
            statusCode:400,
            message:"user creation failed",
            data:error
        });
        res.status(response.statusCode).send(response)
        
    }
}


exports.getuser = async function (req, res) {
    try {
        const allUsers = await users.find();
        if (allUsers && allUsers.length > 0) {
            // Sends response if users is found
            const response = {
                statusCode: 200,
                message: "Success",
                data: allUsers
            };
            res.status(200).send(response);
        } else {
            // Error response if users not found
            const response = {
                statusCode: 404,
                message: "No users found"
            };
            res.status(404).send(response);
        }
    } catch (error) {
        // Server error response if any error occurs
        console.error("Error fetching users:", error);
        const response = {
            statusCode: 500,
            message: "Internal server error"
        };
        res.status(500).send(response);
    }
}
