const express  = require("express")
const router = express.Router()
const SubscribeM = require("../models/Subscriber")

// POST /api/subscribe
// handle newsletter subscription
// public
router.post("/", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    try {
        // check if email is already subscribed
        let subscriber = await SubscribeM.findOne({ email });
        if (subscriber) {
            return res.status(400).json({ message: "Email is already present" });
        }
        // Create a new subscriber
        subscriber = new SubscribeM({ email });
        await subscriber.save();
        res.status(201).json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;