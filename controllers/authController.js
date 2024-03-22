let success_function = require("../Utils/response-handler").success_function;
let error_function = require("../Utils/response-handler").error_function;
const sendEmail = require("../Utils/sendEmail").sendEmail;
const resetPassword = require("../Utils/reset_password").resetPassword;
const users = require("../db/models/users");
let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");
let dotenv = require("dotenv");
dotenv.config();
const user_types = require("../db/models/user_types");

// exports.login = async function (req, res) {
//   try {
//     let email = req.body.email;
//     let password = req.body.password;

//     if (email && password) {
//       let user = await users.findOne({
//         $and: [{ email: email }],
//       });

//       if (!user) {
//         let response = error_function({
//           statusCode: 400,
//           message: "Invalid Email",
//         });
//         res.status(response.statusCode).send(response);
//         return;
//       }

//       if (user) {
//         let db_password = user.password;
//         console.log("db_password : ", db_password);

//         bcrypt.compare(password, db_password, (err, auth) => {
//           if (auth === true) {
//             let access_token = jwt.sign(
//               { user_id: user._id },
//               process.env.PRIVATE_KEY,
//               { expiresIn: "1d" }
//             );
//             console.log("access_token : ", access_token);

//             let response = success_function({
//               statusCode: 200,
//               data: access_token,
//               message: "Login Successfull",
//             });
//             res.status(response.statusCode).send(response);
//             return;
//           } else {
//             let response = error_function({
//               statusCode: 401,
//               message: "invalid password",
//             });
//             res.status(response.statusCode).send(response);
//             return;
//           }
//         });
//       } else {
//         let response = error_function({
//           statusCode: 401,
//           message: "invalid Credentials",
//         });
//         res.status(response.statusCode).send(response);
//         return;
//       }
//     } else {
//       if (!email) {
//         let response = error_function({
//           statusCode: 422,
//           message: "email is required",
//         });
//         res.status(response.statusCode).send(response);
//         return;
//       }

//       if (!password) {
//         let response = success_function({
//           statusCode: 422,
//           message: "password required",
//         });
//         res.status(response.statusCode).send(response);
//         return;
//       }
//     }
//   } catch (error) {
//     if (process.env.NODE_ENV == "production") {
//       let response = error_function({
//         statusCode: 400,
//         message: error
//           ? error.message
//             ? error.message
//             : error
//           : "something went wrong",
//       });
//       res.status(response.statusCode).send(response);
//       return;
//     } else {
//       let response = error_function({ status: 400, message: error });
//       res.status(response.statusCode).send(response);
//       return;
//     }
//   }
// };



exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if the user exists in the database
    const user = await users.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    
    const auth = await bcrypt.compare(password, user.password);
let firstlogin =!user.lastLogin;
if(firstlogin){
  await users.updateOne({email:email},{$set:{lastLogin:new Date()}})
}
    if (auth) {
      // Passwords match, proceed with login
      const userType = await user_types.findOne({ _id: user.user_type });
      
      if (!userType) {
        return res.status(400).json({ message: "User type not found" });
      }

      

      const access_token = jwt.sign(
        { user_id: user._id, user_type: userType.user_type },
        process.env.PRIVATE_KEY,
        { expiresIn: "1d" }
      );

      // Sending the response with access token, user data, and the requiresPasswordChange variable
      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: { user, access_token, lastLogin:user.lastLogin},
        message: "Login successful",
      });
    } else {
      // Passwords do not match
      return res.status(401).json({ message: "Invalid Password" });
    }
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



exports.forgotPasswordController = async function (req, res) {
  try {
    let email = req.body.email;

    if (email) {
      let user = await users.findOne({ email: email });
      if (user) {
        let reset_token = jwt.sign(
          { user_id: user._id },
          process.env.PRIVATE_KEY,
          { expiresIn: "10m" }
        );
        let data = await users.updateOne(
          { email: email },
          { $set: { password_token: reset_token } }
        );
        if (data.matchedCount === 1 && data.modifiedCount == 1) {
          let reset_link = `${process.env.FRONTEND_URL}/reset-password?token=${reset_token}`;
          let email_template = await resetPassword(user.name, reset_link);
          sendEmail(email, "Forgot password", email_template);
          let response = success_function({
            statusCode: 200,
            message: "Email sent successfully",
          });
          res.status(response.statusCode).send(response);
          return;
        } else if (data.matchedCount === 0) {
          let response = error_function({
            statusCode: 404,
            message: "User not found",
          });
          res.status(response.statusCode).send(response);
          return;
        } else {
          let response = error_function({
            statusCode: 400,
            message: "Password reset failed",
          });
          res.status(response.statusCode).send(response);
          return;
        }
      } else {
        let response = error_function({
          statusCode: 403,
          message: "Forbidden",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    } else {
      let response = error_function({
        statusCode: 422,
        message: "Email is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }
  } catch (error) {
    if (process.env.NODE_ENV == "production") {
      let response = error_function({
        statusCode: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });

      res.status(response.statusCode).send(response);
      return;
    } else {
      let response = error_function({ statusCode: 400, message: error });
      res.status(response.statusCode).send(response);
      return;
    }
  }
};
// exports.passwordResetController = async function (req, res) {
//   try {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader.split(" ")[1];

//     let password = req.body.password;

//     decoded = jwt.decode(token);
//     console.log("user_id : ", decoded.user_id);
//     console.log("Decoded token: ", decoded); // Log decoded token
//     console.log("Token : ", token);
//     let user = await users.findOne({
//       $and: [{ _id: decoded.user_id }, { password_token: token }],
//     });
//     if (user) {
//       let salt = bcrypt.genSaltSync(10);
//       let password_hash = bcrypt.hashSync(password, salt);
//       let data = await users.updateOne(
//         { _id: decoded.user_id },
//         { $set: { password: password_hash, password_token: null } }
//       );
//       if (data.matchedCount === 1 && data.modifiedCount == 1) {
//         let response = success_function({
//           statusCode: 200,
//           message: "Password changed successfully",
//         });
//         res.status(response.statusCode).send(response);
//         return;
//       } else if (data.matchedCount === 0) {
//         let response = error_function({
//           statusCode: 404,
//           message: "User not found",
//         });
//         res.status(response.statusCode).send(response);
//         return;
//       } else {
//         let response = error_function({
//           statusCode: 400,
//           message: "Password reset failed",
//         });
//         res.status(response.statusCode).send(response);
//         return;
//       }
//     } else {
//       let response = error_function({ status: 403, message: "Forbidden" });
//       res.status(response.statusCode).send(response);
//       return;
//     }
//   } catch (error) {
//     if (process.env.NODE_ENV == "production") {
//       let response = error_function({
//         statusCode: 400,
//         message: error
//           ? error.message
//             ? error.message
//             : error
//           : "Something went wrong",
//       });

//       res.status(response.statusCode).send(response);
//       return;
//     } else {
//       let response = error_function({ statusCode: 400, message: error });
//       res.status(response.statusCode).send(response);
//       return;
//     }
//   }
// };
exports.passwordResetController = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      console.log("Authorization header not found");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Received token: ", token);

    let password = req.body.password;
    if (!password) {
      console.log("Password cannot be empty");
      return res.status(400).json({ message: "Password cannot be empty" });
    }

    decoded = jwt.decode(token);
    console.log("Decoded token: ", decoded); // Log decoded token
    console.log("Token : ", token);
    if (!decoded || !decoded.user_id) {
      console.log("User ID not found in decoded token");
      return res.status(401).json({ message: "Unauthorized" });
    }

    let user = await users.findOne({
      $and: [{ _id: decoded.user_id }, { password_token: token }],
    });
    if (user) {
      let salt = bcrypt.genSaltSync(10);
      let password_hash = bcrypt.hashSync(password, salt);
      let data = await users.updateOne(
        { _id: decoded.user_id },
        { $set: { password: password_hash, password_token: null } }
      );
      if (data.matchedCount === 1 && data.modifiedCount == 1) {
        let response = success_function({
          statusCode: 200,
          message: "Password changed successfully",
        });
        res.status(response.statusCode).send(response);
        return;
      } else if (data.matchedCount === 0) {
        let response = error_function({
          statusCode: 404,
          message: "User not found",
        });
        res.status(response.statusCode).send(response);
        return;
      } else {
        let response = error_function({
          statusCode: 400,
          message: "Password reset failed",
        });
        res.status(response.statusCode).send(response);
        return;
      }
    } else {
      let response = error_function({ statusCode: 403, message: "Forbidden" });
      res.status(response.statusCode).send(response);
      return;
    }
  } catch (error) {
    console.error("Error: ", error);
    if (process.env.NODE_ENV == "production") {
      let response = error_function({
        statusCode: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });

      res.status(response.statusCode).send(response);
      return;
    } else {
      let response = error_function({ statusCode: 400, message: error });
      res.status(response.statusCode).send(response);
      return;
    }
  }
};
exports.changePassword = async (req, res) => {
  const { email } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    // Find user by email
    const user = await users.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if old password matches
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect old password" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();
    let response = ({
      statusCode: 200,
      success:true,
      message: "Password changed successfully",
    });
    res.status(response.statusCode).send(response);
    return;

    
  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
