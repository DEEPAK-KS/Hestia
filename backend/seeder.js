const mongoose  = require("mongoose")
const dotenv = require("dotenv")
const ProductM = require("./models/Product")
const CartM = require("./models/Cart")
const userM = require("./models/user")
const products = require("../products")

dotenv.config();

// mongodb connection
mongoose.connect(process.env.MONGO_URI);

// Function to seed the data
const seedData = async () =>{
    try{
        // Clear previous data
        await ProductM.deleteMany();
        await userM.deleteMany();
        await CartM.deleteMany();

        // Create a defauly admin
        const createdUser = await userM.create({
            name: "admin",
            email: "admin@gmail.com",
            password : "Admin@123",
            role: "Admin"
        })

        // Assign default user id to each product 
        const userID = createdUser._id;
        const sampleProducts = products.map((product) => {
            return{...product, user: userID}
        })

        // inser product innto Db
        await ProductM.insertMany(sampleProducts);
        console.log("Data seeded successfully")
        process.exit();
    }catch(error){
        console.error(error);
        process.exit(1);
    }
};

seedData();