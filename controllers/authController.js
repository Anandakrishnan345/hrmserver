
let  error_function  = require('../Utils/response-handler').error_function;
let success_function = require('../Utils/response-handler').success_function;
const users = require('../db/models/users');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.login = async function (req,res){
    console.log('Login function entered');
    try{
        let email = req.body.email;
        let password = req.body.password;
        console.log('Login request received:', email, password );
        console.log("email",email);
        console.log("password",password)
        if(email && password){
            let user = await users.findOne({email});
            console.log("user",user);
            if(!user){
                let response = error_function(
                    {
                        statusCode:400,
                        message : "email invalid"

                    }
                );
                console.log('response',response)
                res.status(response.statusCode).send(response);
                return;
            }
            // let user_type = user.user_type.user_type;
            if(user){
                let db_password=user.password;
                console.log("db_pasword",db_password)
                console.log('Before bcrypt.compare block');
                bcrypt.compare(password,user.password,async(error,auth)=>{
                    console.log('Inside bcrypt.compare block');
                    if (error) {
                        console.error("An error occurred during password comparison:", error);
                        let response = error_function({
                          status: 500,
                          message: "Internal server error"
                        });
                        res.status(response.statusCode).send(response);
                        return;
                      }
                      console.log('Password comparison result:', auth);
                    if(auth=== true){
                        let access_token = jwt.sign(
                            {user_id : user.user_id},
                            process.env.PRIVATE_KEY,
                            {expiresIn : "10d"}
                        );
                        let response = success_function({
                            status : 200,
                            data: access_token,
                            message : "Login successful"
                        });
                        response.user_type = user_type;
                        res.status(response.statusCode).send(response);
                        return;

                    } else {
                        let response = error_function({
                            status : 401,
                            message:"invalid password"

                        });
                        res.status(response.statusCode).send(response);
                        return;
                    }
                });
            } else {
                let response = error_function({
                    status:401,
                    message : "Invalid credentials",
                });
                res.status(response.statusCode).send(response);
                return;
            }

        }
    } catch (error) {
        console.error("An error occurred during login:", error);
        console.log("Axios response:", error.response); 
    
        let response = error_function({
            status: 500,
            message: error ? error.message : "Internal server error",
        });
    
        res.status(response.statusCode).send(response);
        return;
    }
    
}
