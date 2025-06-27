const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, "Plese enter a valid email address"]
    },
    password:{
        type: String,
        required: true,
        minLength: 6,
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Plese enter a valid password address"]
    },
    role:{
        type: String,
        enum: ["Customer","Admin"],
        default: "Customer"
    },
},
{timestamps: true}
)

// password Hash func
userSchema.pre("save",async function (next) {
    if (!this.isModified("password"))
        return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
})


// Match user entered password to hashed password
userSchema.methods.matchPassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
};

module.exports = mongoose.model("user", userSchema);