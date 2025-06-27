const express = require("express");
const ProductM = require("../models/Product")
const {admin,protect} = require("../middleWare/authMidlewae")
const router = express.Router();

// GET /api/admin/products
// Get all products
// private admin
router.get("/",protect,admin, async (req,res)=>{
    try {
        const products = await ProductM.find({});
        res.json(products)

    } catch (error) {
       console.log(error);
       return res.status(500).json({ message: "server error" }); 
    }
})

module.exports = router;