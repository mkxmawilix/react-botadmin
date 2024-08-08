require("dotenv").config({ path: "../.env" });
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res) => {
    console.log("#########  CREATE USER  #########");
    console.log(req.body);
    console.log(req.user);
    const { email, password, username } = req.body;

    User.findOne({ email }, (err, existingUser) => {
        if (err) {
            return res.status(500).json({
                message: "Error querying User collection: " + err,
            });
        }

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return res.status(500).json({
                    message: "Error generating salt: " + err,
                });
            }

            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        message: "Error hashing password: " + err,
                    });
                }

                const newUser = new User({
                    email,
                    password: hash,
                    username,
                });

                newUser
                    .save()
                    .then((savedUser) => {
                        const payload = {
                            id: savedUser._id,
                            email: savedUser.email,
                            username: savedUser.username,
                        };

                        const token = jwt.sign(
                            payload,
                            process.env.TOKEN_SECRET,
                            {
                                expiresIn: "1h",
                            }
                        );

                        res.status(201).json({
                            message: "User created",
                            token: "Bearer " + token,
                            user: {
                                username: savedUser.username,
                                id: savedUser._id,
                            },
                        });
                    })
                    .catch((err) => {
                        return res.status(500).json({
                            message: "Error saving user: " + err,
                        });
                    });
            });
        });
    });
};

exports.getUser = (req, res) => {
    console.log("#########  GET USER  #########");
    console.log(req.body);
    console.log(req.user);
    const { userId } = req.body;
    const { email } = req.user;

    User.findOne({ _id: userId, email })
        .select("-password")
        .exec((err, user) => {
            if (err) {
                return res.status(500).json({
                    message: "Error querying User collection: " + err,
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                });
            }

            res.status(200).json({
                user: {
                    id: user._id,
                    username: user.username,
                },
            });
        });
};