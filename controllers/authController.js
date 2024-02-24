
let  error_function  = require('../Utils/response-handler').error_function;
let success_function = require('../Utils/response-handler').error_function;
const users = require('../db/models/users');
exports.login = async function (req,res){
    try{
        let email = req.body.email;
        let password = req.body.password
        if(email && password){
            let user = await users.findone({$and: [{email : email}],}).populate("user_type");
            if(!user){
                let response = error_function(
                    {
                        "status":400,
                        "message" : "email invalid"

                    }
                );
                res.status(response.statusCode).send(response);
                return;
            }
            let user_type = user.user_type.user_type;
            if(user){
                bcrypt.compare(password,user.password,async(error,auth)=>{
                    if(auth=== true){
                        let access_token = jwt.sign(
                            {user_id : user_id},
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
    }catch (error) {
        if(process.env.NODE_ENV =="prouction"){
            let response = error_function({
                status :400,
                message: error ?error.message?error.message : error:"something went wrong",
            });
        }
    }
}