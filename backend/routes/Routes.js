const express = require("express");
const OrderM = require("../models/Order")
const {protect} = require("../middleWare/authMidlewae")
const router = express.Router();


// GET /api/orders/my-orders
// get logged in users orders
// private
router.get("/my-orders",protect, async (req,res) =>{
    try {
    // find order for all authenticated user
        const order = await OrderM.find({user: req.user._id}).sort({createdAt: -1})// sort by moost recent order
        res.json(order)
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"})        
    }
})


// GET /api/orders/:id
// get orders by ID
// Private
router.get("/:id",protect, async (req,res) =>{
    try {
        const order = await OrderM.findById(req.params.id).populate(
            "user", "name email"
        );
        if (!order){
            return res.status(404).json({message:"Order not found"})
        }
        // return the full oreder details
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server Error"})        
    }
})


module.exports = router;