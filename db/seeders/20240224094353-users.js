'use strict';

module.exports = {
  up: (models, mongoose) => {
    
     
      return models.users.insertMany([
       {
        _id:"65d9beea8984305a6d73fba8",
        name:"Anandan",
        email:"ckanandu@gmail.com",
        phonenumber:"114555354",
        address :"4th street  kochi ",
        pincode:"682006",
        password: "$2y$10$/2HvfjEpArEciF.WWFaQiu25Z9BYJowMrzrq0WrlL1SRCIetKA4zW"//admin123


       }
      ])
  },

  down: (models, mongoose) => {
    
     
      return models.deleteMany([
        _id ,{
          $in : [
            "65d9beea8984305a6d73fba8",

          ]
        }
      ])
  }
};
