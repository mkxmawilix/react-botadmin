require("dotenv").config({ path: "../.env" });
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: hash,
            username,
        });
        const savedUser = await newUser.save();

        const payload = {
            id: savedUser._id,
            email: savedUser.email,
            username: savedUser.username,
        };

        const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
            expiresIn: "1h",
        });

        res.status(201).json({
            message: "User created",
            token: "Bearer " + token,
            user: {
                username: savedUser.username,
                id: savedUser._id,
            },
        });

    } catch (err) {
        res.status(500).json({
            message: "Error: " + err.message,
        });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect credentials." });
        }

        const payload = {
            id: user._id,
            email: user.email,
        };

        const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
            expiresIn: "1h",
        });

        res.json({
            message: "Logged in Successfully",
            token: "Bearer " + token,
            user: { username: user.username, email:email, id: user._id },
        });
    } catch (err) {
        res.status(500).json({ message: "Error on the server: " + err.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const { email } = req.user;

        const user = await User.findOne({ _id: userId, email }).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (err) {
        res.status(500).json({
            message: "Error querying User collection: " + err.message,
        });
    }
};
