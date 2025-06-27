const express = require("express");
const UserM = require("../models/user")
const {protect, admin} = require("../middleWare/authMidlewae")

const router= express.Router()

// GET /api/admin/users
// Get all users
// private - Admin only
router.get("/",protect, admin, async (req,res)=>{
    try {
        const users = await UserM.find({})
        res.json(users)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error" });

    }
})


// POST /api/admin/users
// Add a new user
// private Admin only
router.post("/", protect, admin, async (req,res)=>{
    const{
        name,
        email,
        password,
        role
    }= req.body;
   try {
    console.log(name, email, password, role);
    let user = await UserM.findOne({ email }) 
    if(user){
        return res.status(400).json({message:"User already exist"})
    }
    user = new UserM({
        name,
        email,
        password,
        role : role || "Customer"
    });

    await user.save();
    res.status(201).json({message:"User created successfully",user})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error" });
    }
})

// PUT /api/admin/users/:id
// update user info
// private Admin only
router.put("/:id",protect,admin, async (req,res)=>{
    try {
        const user = await UserM.findById(req.params.id)
        if (user)
        {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            const updatedUser = await user.save({ validateModifiedOnly: true });
            res.json({ message: "User updated successfully",updatedUser});
        } else {
           return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error" });
    }
})

// delete /api/admin/users/:id
// delete a user
// private -ADMIN
router.delete("/:id",protect,admin, async (req,res)=>{
    try {
        const user = await UserM.findById(req.params.id)
        if (user)
        {
            await user.deleteOne();
            res.json({ message: "User deleted successfully"});
        } else {
           return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error" });
    }
})

module.exports=router;