const Permission = require('../models/Permission');

exports.canConfigureGuild = async (req, res, next) => {
    const { guildId } = req.params;
    const userId = req.user.id;

    try {
        const permission = await Permission.findOne({ guildId, userId });

        if (!permission || permission.role !== 'admin') {
            return res.status(403).json({ message: 'Permission denied.' });
        }

        next();
    } catch (error) {
        console.error('Error checking permissions:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};
