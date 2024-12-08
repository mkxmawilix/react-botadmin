require("dotenv").config({ path: "../.env" });
const axios = require('axios');
const Guild = require('../models/Guild');
const Permission = require('../models/Permission');
const Cog = require('../models/Cog');

exports.getGuilds = async (req, res) => {
    try {
        const flaskResponse = await axios.get(`${process.env.FLASK_URL}/guilds`);

        if (flaskResponse.status === 200) {
            const activeGuilds = flaskResponse.data.guilds;
            const userId = req.user.id;

            const permissions = await Permission.find({ userId, role: 'admin' });
            const allowedGuildIds = permissions.map((permission) => permission.guildId);

            const storedGuilds = await Guild.find({});

            const guildsWithStatus = storedGuilds.map(guild => {
                const isActive = activeGuilds.some(activeGuild => Number(activeGuild.id) === guild.id);
                return {
                    id: guild.id,
                    name: guild.name,
                    creationDate: guild.creationDate,
                    shardId: guild.shardId,
                    owner: guild.owner,
                    canConfigure: allowedGuildIds.includes(guild.id),
                    isActive
                };
            });

            if (req.query.mode === 'config') {
                return res.status(200).json({ guilds: guildsWithStatus.filter(g => g.canConfigure) });
            }

            return res.status(200).json({ guilds: guildsWithStatus });
        } else {
            return res.status(flaskResponse.status).json({ message: "Failed to fetch guilds from the bot." });
        }
    } catch (error) {
        console.error('Error fetching guilds from Flask API:', error);
        return res.status(500).json({ message: "Internal server error." });
    }
};

exports.getGuild = async (req, res) => {
    const { guildId } = req.params;

    try {
        const guildIdNumber = Number(guildId);
        if (isNaN(guildIdNumber)) {
            return res.status(400).json({ message: "Invalid guild ID." });
        }

        const guild = await Guild.findOne({ id: guildIdNumber });
        if (!guild) {
            console.log(`Guild with ID ${guildId} not found in MongoDB.`);
            return res.status(404).json({ message: "Guild not found." });
        }

        const cogs = await Cog.find();
        for (const cog of cogs) {
            const collectionName = cog.collection_name;
            const collection = await Cog.db.collection(collectionName).findOne({ guild_id: guildIdNumber });
            cog.settings = collection;
        }

        const cogsSettings = cogs.map(cog => {
            return {
                name: cog.name,
                settings: cog.settings
            };
        });
        const guildData = {
            id: guild.id,
            name: guild.name,
            creationDate: guild.creationDate,
            shardId: guild.shardId,
            owner: guild.owner,
            isActive: guild.isActive,
            cogsSettings: cogsSettings
        };
        return res.status(200).json(guildData);
    } catch (error) {
        console.error('Error fetching guild from MongoDB:', error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
