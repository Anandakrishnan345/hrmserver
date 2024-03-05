const express=require('express');
const router=express.Router();
const userController=require("../controllers/usercontroller");
const checkLogin=require('../Utils/checklogin').checkLogin;


router.post('/adduser',userController.addUser);
router.get('/getuser',userController.getuser);
router.get('/viewuser/:id', userController.viewuser);
router.put('/update/:id',userController.updateUser);
router.delete('/delete/:id',userController.deleteUser);

module.exports=router;