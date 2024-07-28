const cron = require('node-cron');
const axios = require('axios');
const Guild = require('../models/Guild');

cron.schedule('*/5 * * * *', async () => {
    console.log('Running guild update job...');
    try {
        const flaskResponse = await axios.get(`${process.env.FLASK_URL}/guilds`);
        if (flaskResponse.status === 200) {
            const activeGuilds = flaskResponse.data.guilds.map(g => g.id);
            console.log('Active guilds:', activeGuilds);
            await Guild.updateMany({}, { isActive: false });
            await Guild.updateMany({ id: { $in: activeGuilds } }, { isActive: true });

            console.log('Guild status updated successfully.');
        }
    } catch (error) {
        console.error('Error updating guild status:', error);
    }
});
