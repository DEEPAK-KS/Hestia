const express = require("express");
const ProductM = require ("../models/Product");
const {protect, admin} = require("../middleWare/authMidlewae")
const router = express.Router();

// POST /api/products
// create a new product in DB
// Privare-Admin

router.post("/",protect, admin, async (req,res) => {
        try{
            const {
            name,
            description,
            price,
            discountPrice,
            countInStock, // <-- update here
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isfeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku} = req.body;

            const product = new ProductM ({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isfeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user: req.user._id //id of the admin who created it
            })
            const createdProduct = await product.save();
            res.status(201).json(createdProduct)
        }catch (error) {
            console.error(error);
            res.status(500).send("Server Error")
        }
    });

// PUT /api/prodcts/:id
// Update a product by Id
// Access admin only

router.put("/:id", protect, admin, async (req, res) => {
    try{
         const {
            name,
            description,
            price,
            discountPrice,
            countInstock, 
            category,
            brand,
            sizes,
            colors,
            collections,
            material,
            gender,
            images,
            isfeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku} = req.body;

            // find the product by Id
            const product = await ProductM.findById(req.params.id)

            if (product) {
                product.name = name || product.name;
                product.description = description || product.description;
                product.price = price || product.price;
                product.discountPrice = discountPrice || product.discountPrice;
                product.countInstock = countInstock || product.countInstock; // <-- update here
                product.category = category || product.category;
                product.brand = brand || product.brand;
                product.sizes = sizes || product.sizes;
                product.colors = colors || product.colors;
                product.collections = collections || product.collections;
                product.material = material || product.material;
                product.gender = gender || product.gender;
                product.images = images || product.images;
                product.isfeatured = isfeatured !== undefined ? isfeatured : product.isfeatured;
                product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
                product.tags = tags || product.tags;
                product.dimensions = dimensions || product.dimensions;
                product.weight = weight || product.weight;
                product.sku = sku || product.sku;

                // Snd to DB
                const updatedProduct = await product.save();
                res.json(updatedProduct);
            } else {
                res.status(404).json({ message: "Product not found" });
            }
    } catch(error){
        console.error(error);
        res.status(500).send("Server Error")
    }
});


// /api/products/:id
// delete a product by Id
// Authenticated users only

router.delete("/:id", protect, admin, async (req,res) =>{
    try{
        // Find product by ID
        const product = await ProductM.findById(req.params.id)
        if (product){
            // delete product
            await product.deleteOne();
            res.json({messgae:"Product Remover"})
        }
        else{
            res.status(404).json({message: "Product not found"})
        }
    }catch(error){
        console.error(error);
        res.status(500).send("Server Error")
    }
})

// GET /api/products
// get all products with optionaal filterig
// piblic
router.get("/",async (req,res) =>{
    try {
        const {
            collection,
            size,
            colors,
            gender,
            minPrice,
            maxPrice,
            sortBy,
            search,
            category,
            material,
            brand,
            limit
        } = req.query;

        let query = {};

        // Filter Logic
        if (collection && collection.toLowerCase() !== "all") {
            query.collections = collection;
        }
        if (size ) {
            query.sizes = {$in: size.split(",")};
        }
        if (colors ) {
            query.colors = {$in: [colors]};
        }
        if (gender ) {
            query.gender = gender;
        }
        if (category) {
            query.category = category;
        }
        if (material ) {
            query.material = {$in: material.split(",")};
        }
        if (brand ) {
            query.brand = {$in: brand.split(",")};
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
       if (search) {
            const words = search.split(" ").filter(Boolean); // split by space

            query.$or = words.flatMap(word => [
                { name: { $regex: word, $options: "i" } },
                { description: { $regex: word, $options: "i" } },
                { category: { $regex: word, $options: "i" } },
                { collections: { $regex: word, $options: "i" } },
                { brand: { $regex: word, $options: "i" } },
                { material: { $regex: word, $options: "i" } },
                { gender: { $regex: word, $options: "i" } }
        ]);
    }


        // Sort logic
        let sort = {};
        switch (sortBy) {
            case "priceAsc":
            sort = { price: 1 };
            break;
            case "priceDesc":
            sort = { price: -1 };
            break;
            case "popularity":
            sort = { rating: -1 }; // Or use { createdAt: -1 } if you want newest first
            break;
            default:
            sort = {}; // No sorting
            break;
        }

        // fetch products and apply sorting & Limit
        let products = await ProductM.find(query).sort(sort).limit(Number(limit) ||  0)
        console.log(products)
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});


//GET /api/products/now-arrivals
// latest products based on creation date
router.get("/new-arrivals", async (req,res) =>{
    try {
        // latest 8 products
        const newArrivals = await ProductM.find().sort({createdA: -1}).limit(8);
        res.json(newArrivals);
    } catch (error) {
        console.log(error);
        res.status(500).send("Server error")
    }
})


// GET /api/products/best-seller
// return product with the highest raiting
// public
router.get("/best-seller", async (req,res)=>{
    try{
        const bestSeller = await ProductM.findOne().sort({rating:-1});
        if(bestSeller){
            res.json(bestSeller);
        }else{
            res.status(404).json({message:"No best seller found"})
        }
    }
    catch(error){
        console.group(error);
        res.status(500),send("Server error")
    }
})



// GET /api/product/:id
// get a single product details by id
// public access

router.get("/:id", async (req,res) =>{
    try{
        const product = await ProductM.findById(req.params.id);
        if (product){
            console.log("Product found:", product);
            res.json(product);
        }else{
            res.status(404).json({message:"Product not found"})
        }
    }catch(error){
        console.error(error);
        res.status(500).send("Server error");
    }
});

//GET /api/products/simila/:id
// Return simillar products based on current products
// public
router.get("/similar/:id", async (req,res) =>{
    const {id} = req.params;
    try{
        const product = await ProductM.findById(id);
        if(!product){
            res.status(404).json({message:"product not found"})
        }
        const similarProducts = await ProductM.find({
        _id: { $ne: id },
        gender: product.gender,
        category: product.category,
        }).limit(4);
        res.json(similarProducts);
    }catch(error){
        console.log(error);
        res.status(500).send("Server error");
    }
});

module.exports = router;