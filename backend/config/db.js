const mongoose =require ("mongoose");

const connectDb = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongo Db connected Successfully")
    }
    catch (err){
        console.err("Mongo Db connection failed",err);
        process.exit(1);
    }

};

module.exports = connectDb;