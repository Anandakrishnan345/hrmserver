'use strict';

module.exports = {
  up: (models, mongoose) => {

    return models.users
    .insertMany([
      {
        _id:"65d9beea8984305a6d73fba8",
        name:"Anandan",
        email:"ckanandu@gmail.com",
        phonenumber:"7895564120",
        Address:"4th street  kochi",
        pincode:"682006",
        password:"$2y$10$/2HvfjEpArEciF.WWFaQiu25Z9BYJowMrzrq0WrlL1SRCIetKA4zW",//admin123
        user_type:"65eecb8e18357aefe2c8f15b"


      },
     
    ])
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return models.Test.bulkWrite([
        {
          insertOne: {
            document: {
              name: 'first test'
            }
          }
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
    */
  },

  down: (models, mongoose) => {


    return models.users
    .deleteMany({
      _id:{
        $in:[
         "65d9c2889f9dfda2f46d8b7d",
          "65d9c2929f9dfda2f46d8b7e"
        ],
      },
    })
    .then((res)=>{
      console.log(res.deletedCount);
    });
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return models.Test.bulkWrite([
        {
          deleteOne: {
            filter: {
              name: 'first test'
            }
          }
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
    */
  }
};
