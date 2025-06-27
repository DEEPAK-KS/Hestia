const express = require("express");
const CartM = require("../models/Cart");
const ProductM = require("../models/Product");
const {protect} = require("../middleWare/authMidlewae");
const user = require("../models/user");
const mongoose = require("mongoose");
const router = express.Router();

// Helper function to decide cartId by Userid or Guestid
const getCart = async (userId, guestId) => {
    if (userId) {
        return await CartM.findOne({ user: userId });
    } else if (guestId) {
        return await CartM.findOne({ guestId: guestId });
    }
    return null;
}


// POST /api/cart
// Add a product to the cart for guest/user
// public

router.post("/",async (req,res) =>{
    const {productId,
        quantity, 
        size,
        color, 
        userId,
        guestId,
        } = req.body;

        try {
            const product = await ProductM.findById(productId);
            if (!product) return res.status(404).json({message: "Product not found"});
            // Determine if the user is logged in as User/Guest
            let cart = await getCart(userId, guestId);
            // if cart exist update it
            if (cart){
                const productIndex = cart.products.findIndex((p) =>
                    p.productId.toString() === productId && 
                    p.size === size &&
                    p.color == color );
                    if (productIndex > -1) {
                        // if product exist in cart update the quantity
                        cart.products[productIndex].quantity += quantity;
                    }
                    else{
                        // add new product
                        cart.products.push({
                            productId,
                            name: product.name,
                            image: product.images[0].url,
                            price: product.discountPrice,
                            size,
                            color,
                            quantity
                        });
                    }
                    // Recalculate the total price
                    cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
                    await cart.save();
                    return res.status(200).json(cart)
            }else{
                // Create a new cart guest/ user
                const newCart = await CartM.create({
                    user: userId ? userId : undefined,
                    guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                    products: [
                        {
                            productId,
                            name: product.name,
                            image: product.images[0].url,
                            price: product.discountPrice,
                            size,
                            color, 
                            quantity
                        }
                    ],
                    totalPrice: product.discountPrice * quantity
                });
                return res.status(201).json(newCart)
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({message:"Server Error"});
        }
})

// PUT /api/cart
//update product quantity
// public

router.put("/", async (req, res) => {
    const {
        productId,
        size,
        color,
        guestId,
        quantity,
        userId
    } = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        if (!Array.isArray(cart.products)) {
            console.error("Cart products is not an array", cart.products);
            return res.status(500).json({ message: "Cart products is not an array" });
        }

        const productIndex = cart.products.findIndex((p) =>
            p.productId.toString() === productId &&
            p.size === size &&
            p.color == color
        );

        if (productIndex > -1) {
            // update quantity
            if (typeof quantity !== "number" || isNaN(quantity)) {
                return res.status(400).json({ message: "Invalid quantity" });
            }
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.splice(productIndex, 1); // remove the product if the quantity is 0
            }

            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.log("PUT /api/cart error:", error);
        return res.status(500).json({ message: "server error", error: error.message });
    }
});


// DELETE /api/cart
// Remove product from the cart
// public

router.delete("/", async (req,res) => {
    const {
        productId,
        quantity,
        size,
        color,
        guestId,
        userId
    } = req.body;

    try {
        const cart = await getCart(userId, guestId);
        if(!cart) return res.status(404).json({mesage : "cart not found"});
        const productIndex = cart.products.findIndex((p) =>
            p.productId.toString() === productId &&
            p.size === size &&
            p.color == color
        );

        if(productIndex > -1){
            cart.products.splice(productIndex, 1);
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });

    }
})

// GET /api/cart
// get content of the cart for guest and user
router.get("/",async (req,res) =>{
    const {
        userId,
        guestId
    } = req.query;

        try {
            // Determine if the user is logged in as User/Guest
            let cart = await getCart(userId,guestId);

            if (cart){
                res.json(cart)
            } else{
                res.status(404).json({message:"Cart not found"})
            }
           
        } catch (error) {
            console.error(error);
            res.status(500).json({message:"Server Error"});
        }
})


// POST /api/cart/merge
// Merge guest cart into user cart on login
// private

router.post("/merge", protect, async (req, res) => {
    const { guestId } = req.body;
    try {
            const guestCart = await CartM.findOne({guestId})
            const userCart = await CartM.findOne({user: req.user._id})

            if (guestCart) {
                if (guestCart.products.length === 0){
                    return res.status(400).json({message: "Guest cart is empty"})
                }
                if (userCart) {
                    guestCart.products.forEach((guestItem) => {
                        const productIndex = userCart.products.findIndex((item) =>
                            item.productId.toString() === guestItem.productId.toString() && 
                            item.size === guestItem.size && 
                            item.color === guestItem.color
                        );
                        if (productIndex > -1){
                            // if items exist in the user cart, update the quantity
                            userCart.products[productIndex].quantity += guestItem.quantity;
                        } else {
                            // otherwise add the product into the cart
                            userCart.products.push(guestItem);
                        }
                    });

                    userCart.totalPrice = userCart.products.reduce((acc,item) => acc + item.discountPrice * item.quantity,0);
                    await userCart.save();

                    // remove the guest cart after merge
                    try {
                        await CartM.findOneAndDelete({guestId});
                    } catch (error) {
                        console.log(error);
                    }
                    res.status(200).json(userCart);
                } else {
                    // if the user has no existing cart assign the guest cart to the user
                    guestCart.user = req.user._id;
                    guestCart.guestId = undefined;
                    await guestCart.save();

                    res.status(200).json(guestCart);
                }
            } else {
                if (userCart) {
                    // if guestCart has already been merged simply return the userCart
                    return res.status(200).json(userCart);
                }
                res.status(404).json({message:"guest cart not found"});
            }

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Server error"})
    }   
})

module.exports = router;