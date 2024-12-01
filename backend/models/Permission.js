const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
    guildId: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'editor', 'viewer'],
        required: true
    }
});

module.exports = mongoose.model('Permission', PermissionSchema);
