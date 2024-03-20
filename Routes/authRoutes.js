const express=require('express');
const router=express.Router();
const accessControl =require('../Utils/access-control').accessControl;

const authController=require('../controllers/authController');

const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
};

router.post('/login',setAccessControl('*') ,authController.login);
router.post('/forgot-password',setAccessControl('*') ,authController.forgotPasswordController);
router.patch('/reset-password', setAccessControl('*') ,authController.passwordResetController);
router.put('/changepassword/:email', authController.changePassword);

module.exports = router;