const express = require("express");
const router = express.Router();
const DiscordController = require("../../controllers/DiscordController");
const Auth = require("../../middleware/Auth");

router.get("/discord/guilds", Auth.auth, DiscordController.getGuilds);

module.exports = router;