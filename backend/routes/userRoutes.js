const express = require("express");
const UserM = require("../models/user");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleWare/authMidlewae");
const router = express.Router();

// route POST /api/users/register
// register a new user
router.post("/register",async (req, res) =>{
    const {name,email,password} =req.body;

    try{
        // Registration Logic
        let user = await UserM.findOne({email});

        if (user) return res.status(400).json({message:"User Already Exists"})
        
        user = new UserM({name, email, password});
        await user.save();

        // Create JWt Payload
        const payload = {
            user: {
                _id: user._id,
                role: user.role
            }
        }

        //Sign and return the token along with user data
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "40h"},(err,token) =>{
            if (err) throw (err);
            // Send the user and token in response
            res.status(201).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token,
            })
        }) 
    }
    catch(error){
        console.log(error);
        res.status(500).send("Server ERROR!");
    }
});

// POST /api/users/login
// Authenticate user

router.post("/login",async (req,res) =>{
    const {email,password} = req.body;

    try{
        // find user by Email
        let user = await UserM.findOne({email});
        if (!user) return res.status(400).json({message:"Invalid Credential"});
        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({message:"Invalid Credentials"});


        // Create JWt Payload
        const payload = {
            user: {
                _id: user._id,
                role: user.role
            }
        }

        //Sign and return the token along with user data
        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "40h"},(err,token) =>{
            if (err) throw (err);
            // Send the user and token in response
            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token,
            })
        }) 

    }
    catch (error){
        console.log(error);
        res.status(500).send("Server ERROR!",error);
    }
})

// GET /ap/user/profile
// get the logged-in user profile
// protected route private
router.get("/profile", protect, async(req,res)=>{
    res.json(req.user);
})

module.exports = router;