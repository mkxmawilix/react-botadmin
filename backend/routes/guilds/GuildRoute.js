const express = require("express");
const router = express.Router();
const GuildController = require("../../controllers/GuildController");
const Auth = require("../../middleware/Auth");

router.get("/guilds", Auth.auth, GuildController.getGuilds);
router.get("/guilds/:guildId", Auth.auth, GuildController.getGuild);

module.exports = router;
