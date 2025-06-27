const express = require("express");
const OrderM = require("../models/Order")
const {admin,protect} = require("../middleWare/authMidlewae")
const router = express.Router();

// GET /api/admin/orders
// Get all orders
// private ADMIN
router.get("/", protect, admin, async (req, res) => {
    try {
            const orders = await OrderM.find({}).populate("user", "name email");
            res.json(orders);
    
        } catch (error) {
           console.log(error);
           return res.status(500).json({ message: "server error" }); 
        }
})


// POST/api/admin/orders/id
// update order status
// private admin
router.post("/:id",protect,admin, async (req,res)=>{
    console.log(req.params.id);
    try {
        const order = await OrderM.findById(req.params.id)
        if (order) {
            // Update order fields from request body
            order.status = req.body.status ||  order.status ;
            order.isDelivered = req.body.status === "Delivered" ? true : order.isDelivered;
            order.deliveredAt = req.body.status ? Date.now() : order.deliveredAt;
            const updatedOrder = await order.save({ validateModifiedOnly: true });
            res.json({ message: "Order updated successfully", updatedOrder });
        } else {
           return res.status(404).json({ message: "order not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error" });
    }
})

// DELETE /api/admin/orders/:id
// delete an order
// private ADMIN
router.delete("/:id",protect,admin, async (req,res)=>{
    try {
        const order = await OrderM.findById(req.params.id)
        if (order) {

            await order.deleteOne();
            res.json({ message: "Order deleted successfully" });
        } else {
           return res.status(404).json({ message: "order not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error" });
    }
})

module.exports=router