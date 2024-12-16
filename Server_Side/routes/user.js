const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../Model/userSchema');


// user post route:
router.post('/register', async (req, res)=>{
    const {name, email, password, mobile} = req.body;

    const isExist = await User.findOne({email});
    if(isExist){
       return res.status(400).json({message: "User Already Exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    try{
        const user = await User.create({
            name,
            email,
            password: hashpassword,
            mobile,
        });
        res.status(200).json({message: "User Created Succefully:"});
    }
    catch (err){
        console.log(err);
        res.status(500).json({message: "Error in Creating User"});
    }
})  


// user login router here:
router.post("/login", async (req,res)=>{
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message: "Wrong username or password"});
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message: "Wrong username or password"});
    }

    const payload = {
        id: user._id
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.status(200).json({token});
})

module.exports = router;