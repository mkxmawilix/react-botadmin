const mongoose = require('mongoose');

const CogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    collection_name: {
        type: String,
        required: true,
        unique: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Cog', CogSchema);
