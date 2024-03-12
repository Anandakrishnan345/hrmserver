const jwt = require("jsonwebtoken");
const authController=require('../controllers/authController');
const error_function = require("./response-handler").error_function;
const control_data = require("./control-data.json");
const users = require("../db/models/users");
const user_types = require("../db/models/user_types");
exports.accessControl = async function (access_types, req, res, next) {
     //middleware to check JWT
  try {
    if (access_types == "*") {
      next();
    } else {
      const authHeader = req.headers["authorization"];
      const token = authHeader ? authHeader.split(" ")[1] : null;
      if (
        token == null ||
        token == "null" ||
        token == "" ||
        token == "undefined"
      ) {
        let response = error_function({
          status: 401,
          message: "Invalid Access Token",
        });
        res.status(401).send(response);
      } else {
        //verifying token
        jwt.verify(
          token,
          process.env.PRIVATE_KEY,
          async function (err, decoded) {
            if (err) {
              let response = error_function({
                status: 401,
                message: err.message,
              });
              res.status(401).send(response);
            } else {
              //checking access control
              let allowed = access_types
                .split(",")
                .map((obj) => control_data[obj]);

              //Fetching user_type details
              console.log("Token from access control : ", decoded.user_id);
              let user_type_id = (await users.findOne({ _id: decoded.user_id })).user_type;
              let user_type = (await user_types.findOne({ _id: user_type_id })).user_type;

              console.log("User type : ", user_type);

              if (allowed && allowed.includes(user_type)) {
              //   //checking if the token is in revoked list
              //   let revoked = await authController.checkRevoked(req, res);
              //   if (revoked === false) {
              //     //token not in revoked list
              //     next();
              //   } else if (revoked === true) {
              //     //token is in revoked list
              //     let response = error_function({
              //       status: 401,
              //       message: "Revoked Access Token",
              //     });
              //     res.status(401).send(response);
              //   } else {
                  // let response = error_function({
                  //   status: 400,
                  //   message: "Something Went Wrong",
                  // });
                  // res.status(400).send(response);
              //   }
              next();
              } else {
                let response = error_function({
                  status: 403,
                  message: "Not allowed to access the route",
                });
                res.status(403).send(response);
                return;
              }
            }
          }
        );
      }
    }
  } catch (error) {
    let response = error_function(error);
    res.status(400).send(response);
  }
};