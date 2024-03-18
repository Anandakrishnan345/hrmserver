const users=require('../db/models/users');
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const { response, request } = require('express');
const success_function=require('../Utils/response-handler').success_function;
const error_function=require('../Utils/response-handler').error_function;
const sendEmail=require('../Utils/sendEmail').sendEmail;
const set_password = require('../Utils/set_password').resetPassword;


exports.addUser=async function(req,res){

    try {
        
        const name=req.body.name;
        const email=req.body.email;
        const password=req.body.password;
        const phonenumber=req.body.phonenumber;
        const Address=req.body.Address;
        const pincode =req.body.pincode;


        
        // Check if the password is empty
        // if (!password || password.trim() === '' || password.length < 6 || password.length > 20 || /\s/.test(password)) {
        //     let response = error_function({
        //         statusCode: 400,
        //         message: 'Password 6-20 characters only-should no spaces allowed'
        //     });
        //     res.status(response.statusCode).send(response);
        //     return;
        // }

        let user_types_id ="65eecbcb18357aefe2c8f15c";//employee id (seed)

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

        //generating random password
        function generateRandomPassword(length) {
            let charset =
              "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
            let password = "";
  
            for (var i = 0; i < length; i++) {
              var randomIndex = Math.floor(Math.random() * charset.length);
              password += charset.charAt(randomIndex);
            }
  
            return password;
          }
  
          var randomPassword = generateRandomPassword(12);
          console.log('random password',randomPassword);

        let salt=await bcrypt.genSalt(10);
        console.log("salt : ",salt);

        let hashed_password=bcrypt.hashSync(randomPassword,salt);
        console.log("hashed_password : ",hashed_password);

        const new_user=await users.create({
            name,
            email,
            password:hashed_password,
            phonenumber,
            Address,
            pincode,
            user_type: user_types_id

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
            let email_template = await set_password(name,email,randomPassword);
            await sendEmail(email,"password",email_template);
            console.log("Email sented...");

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
            message: error.message?error.message:"Something went wrong",
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


exports.viewuser = async function (req, res) {
    try {
        const { id } = req.params;

        // Check if the provided id is a valid ObjectId using Mongoose
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const response = {
                statusCode: 400,
                message: 'Invalid user ID format',
            };
            return res.status(400).send(response);
        }

        // Use findById method from Mongoose
        const oneUser = await users.findById(id);

        if (!oneUser) {
            const response = {
                statusCode: 404,
                message: 'User not found',
            };
            return res.status(404).send(response);
        }

        const response = {
            statusCode: 200,
            message: 'Success',
            data: oneUser,
        };
        res.status(200).send(response);
    } catch (error) {
        console.log('oneUser error is:', error.message);
        const response = {
            statusCode: 400,
            message: error.message,
        };
        res.status(500).send(response);
    }
};

// exports.updateUser = async function (req, res) {

//     try {
//         const { id } = req.params;
//         const result = await users.findByIdAndUpdate(id,req.body);
//         if(!result){
//             const response = {
//                 statusCode: 404,
//                 message: 'User not found',
//             };
//             return res.status(404).send(response);
                

//         }
//         const response = {
//             statusCode: 200,
//             message: 'Update Success',
//             data: result,
//         };
//         res.status(200).send(response); 
        
//     }catch (error) {
//         console.log('updateUser error is:', error.message);
//         const response = {
//             statusCode: 400,
//             message: error.message,
//         };
//         res.status(500).send(response);
//     }
// }

exports.updateUser = async function (req, res) {
    try {
        const { id } = req.params;

        // Check if the provided id is a valid ObjectId using Mongoose
        if (!mongoose.Types.ObjectId.isValid(id)) {
            const response = {
                
                statusCode: 400,
                message: 'Invalid user ID format',
            };
            return res.status(400).send(response);
        }

        const existingUser = await users.findById(id);

        if (!existingUser) {
            const response = {
                statusCode: 404,
                message: 'User not found',
            };
            return res.status(404).send(response);
        }

        // Update user details individually, taking care of validation
        if (req.body.email) {
            // If email is being updated, validate uniqueness
            const isEmailTaken = await users.findOne({ email: req.body.email, _id: { $ne: id } });
            if (isEmailTaken) {
                const response = {
                    statusCode: 400,
                    message: 'Email is already taken',
                };
                return res.status(400).send(response);
            }
            existingUser.email = req.body.email;
        }

        // Update other user details
        existingUser.name = req.body.name || existingUser.name;
        existingUser.phonenumber = req.body.phonenumber || existingUser.phonenumber;
        existingUser.Address = req.body.Address || existingUser.Address;
        existingUser.pincode = req.body.pincode || existingUser.pincode;

        // If you have additional fields, update them in a similar manner

        // Save the updated user, triggering validation
        const result = await existingUser.save();

        const response = {
            statusCode: 200,
            success:true,
            message: 'Update Success',
            data: result,
        };
        res.status(200).send(response);
    } catch (error) {
        console.log('updateUser error is:', error.message);
        const response = {
            statusCode: 400,
            message: error.message,
        };
        res.status(500).send(response);
    }
};


exports.deleteUser = async function (req, res) {
    try {
        const { id } = req.params;
        const result = await users.findByIdAndDelete(id);
        if(!result){
            const response = {
                statusCode: 404,
                message: 'User not found',
            };
            return res.status(404).send(response);

        }
        const response = {
            statusCode: 200,
            message: 'Delete Success',
            data: result,
        };
        res.status(200).send(response);
    }catch (error) {
        console.log('deleteUser error is:', error.message);
        const response = {
            statusCode: 400,
            message: error.message,
        };
        res.status(500).send(response);
    }
}