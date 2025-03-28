// backend/routes/user.js
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
})

router.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(400).json({
            message: "Invalid inputs"
        });
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
        return res.status(409).json({
            message: "Email already taken"
        });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
        username: req.body.username,
        password: hashedPassword, 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });

    const userId = user._id;
    const token = jwt.sign({ userId }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    });
});

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Invalid inputs"
        });
    }

    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Wrong password"
        });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);

    res.json({ token });
});

module.exports = router;
