const mongoose = require("mongoose");

const GuildSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    creationDate: {
        type: Date,
        required: true,
    },
    shardId: {
        type: Number,
        required: true,
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
    owner: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Guild", GuildSchema);
