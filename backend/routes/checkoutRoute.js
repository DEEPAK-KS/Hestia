const express = require("express");
const CheckoutM = require("../models/Checkout")
const CartM = require("../models/Cart")
const OrderM = require("../models/Order")
const {protect} = require("../middleWare/authMidlewae");
const router = express.Router();


// POST /api/checkout
// create a new checkout session
// private
router.post("/",protect,async (req,res) =>{
    const {
        checkoutItems,
        shippingAddress,
        paymentMethod,
        totalPrice
    } = req.body

    if (!checkoutItems || checkoutItems.length === 0){
        return res.status(400).json({message:"no items in checkout"})
    } 
    try {
        // create a new checkout session
        const newCheckout = await CheckoutM.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "pending",
            isPaid: false
        })
        res.status(201).json(newCheckout)
    } catch (error) {
        console.error("Error Creating checkout session", error);
        res.status(500).json({message:"Server Error"});
        
    }
});


// PUT /api/checkout/:id/pay
// Update checkout to marked as paid after successful payment
// private
router.put("/:id/pay", protect, async (req,res) =>{
    const {
        paymentStatus,
        paymentDetails
    } =  req.body
    try {
        const checkout = await CheckoutM.findById(req.params.id);

        if (!checkout) {
            return res.status(404).json({message:"Checkout not found"})
        }

        if (paymentStatus === "paid"){
            checkout.isPaid= true;
            checkout.isPaid= true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails
            checkout.paidAt = Date.now()
            await checkout.save();
            
            res.status(200).json(checkout)
        } else {
            res.status(400).json({message:"Invalid payment Status"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server error"});
        
    }
})


// POST /api/checkout/:id/finalize
// Finalize checkout and convert to an order after payment confirmation
// private
router.post("/:id/finalize", protect, async (req,res) =>{
    try {
        const checkout = await CheckoutM.findById(req.params.id)

        if(!checkout){
            return res.status(404).json({message:"checkout not found"})
        }

        if(checkout.isPaid && !checkout.isFinalized){
            //create final order based on checkout details
            const finalOrder = await OrderM.create({
                user: checkout.user,
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "paid",
                paymentDetails: checkout.paymentDetails
            });

            // mark the checkout as finalized

            checkout.isFinalized = true
            checkout.finalizedAt= Date.now()
            await checkout.save()

            // Delete the cart associated with the user
            await CartM.findOneAndDelete({user: checkout.user})
            res.status(201).json(finalOrder)
        } else if( checkout.isFinalized){
            return res.status(400).json({message:"Checkout already finalized"})
        }else{
            res.status(400).json({message:"Checkout is not paid"})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Server error"})
        
    }
}) 

module.export = router;module.exports = router;