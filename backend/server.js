const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes")
const cartRoutes = require("./routes/cartRoutes")
const checkoutRoute = require("./routes/checkoutRoute")
const orderRoutes = require("./routes/Routes")
const uploadRoutes = require("./routes/uploadroutes")
const subscriberRoutes = require("./routes/subscribeRoute")
const adminRoutes = require("./routes/adminRoutes")
const productAdminRoutes = require("./routes/productAdminRoutes")
const orderAdminRoutes = require("./routes/adminOrderRoutes")




const app = express();
app.use(express.json());
app.use(cors());

dotenv.config()
                                            
const PORT = process.env.PORT || 3000;

app.get("/", (req,res) =>{
    res.send("Welcome to Rabbit API")
})

// API Routes
app.use("/api/users", userRoutes)
app.use("/api/products",productRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/checkout",checkoutRoute)
app.use("/api/orders",orderRoutes)
app.use("/api/upload",uploadRoutes)
app.use("/api/subscribe",subscriberRoutes)
app.use("/api/admin/products",productAdminRoutes)



// Admin Routes
app.use("/api/admin/users",adminRoutes)
app.use("/api/admin/orders",orderAdminRoutes)



// mongo DB connection
connectDB();


app.listen(PORT, () =>{
    console.log(`Server is running on http://localhost:${PORT}`);
})