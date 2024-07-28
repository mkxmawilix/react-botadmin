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
        enum: ['admin', 'member'],
        required: true
    }
});

module.exports = mongoose.model('Users_Permissions', PermissionSchema);
