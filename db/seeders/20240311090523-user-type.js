'use strict';

const { model } = require("mongoose");

module.exports = {
  up: (models, mongoose) => {
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
   return models.user_types.insertMany([
    {
      _id:"65eecb8e18357aefe2c8f15b",
      user_type:"admin"
    },
    {
      _id:"65eecbcb18357aefe2c8f15c",
      user_type:"employee"
    }
   ])
  },

  down: (models, mongoose) => {
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
   return models.user_types.deleteMany({
    _id:{
      $in:[
        "65eecb8e18357aefe2c8f15b",
        "65eecbcb18357aefe2c8f15c"
      ]
    }
   })
  }
};
