const express=require('express');
const router=express.Router();
const userController=require("../controllers/usercontroller");
const checkLogin=require('../Utils/checklogin').checkLogin;
const accessControl =require('../Utils/access-control').accessControl;


const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
};


router.post('/adduser',setAccessControl('1'),userController.addUser);
router.get('/getuser',setAccessControl('1'),userController.getuser);
router.get('/viewuser/:id', userController.viewuser);
router.put('/update/:id',userController.updateUser);
router.delete('/delete/:id',userController.deleteUser);

module.exports=router;