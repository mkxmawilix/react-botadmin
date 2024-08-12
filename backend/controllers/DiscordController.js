require("dotenv").config({ path: "../.env" });
const axios = require('axios');
const Guild = require('../models/Guild');

exports.getGuilds = async (req, res) => {
    try {
        const flaskResponse = await axios.get(`${process.env.FLASK_URL}/guilds`);

        if (flaskResponse.status === 200) {
            const activeGuilds = flaskResponse.data.guilds;
            const storedGuilds = await Guild.find({});

            const guildsWithStatus = storedGuilds.map(guild => {
                const isActive = activeGuilds.some(activeGuild => activeGuild.id === guild.id);
                return {
                    id: guild.id,
                    name: guild.name,
                    creationDate: guild.creationDate,
                    shardId: guild.shardId,
                    owner: guild.owner,
                    isActive
                };
            });

            return res.status(200).json({ guilds: guildsWithStatus });
        } else {
            return res.status(flaskResponse.status).json({ message: "Failed to fetch guilds from the bot." });
        }
    } catch (error) {
        console.error('Error fetching guilds from Flask API:', error);
        return res.status(500).json({ message: "Internal server error." });
    }
};
