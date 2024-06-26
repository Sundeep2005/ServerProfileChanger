const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const cron = require('node-cron');
const config = require('./config.json');
const fetch = require('node-fetch')

const client = new Client({
    intents: Object.keys(GatewayIntentBits).map((a) => {
        return GatewayIntentBits[a]
    })
});

client.once('ready', () => {
    console.log('billy bot is aan <3');

    cron.schedule('0 * * * *', changeServerIcon);

    client.on('messageCreate', async (message) => {
        if(message.content === '!changeicon') {

            if(message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                await changeServerIcon();

            } else {
                message.channel.send('Jij hebt letterlijk geen rechten, NIFFOOWW!');
            }
        }
    })

    async function changeServerIcon() {
        try {
            const guild = client.guilds.cache.get(config.guildid);
            const random = guild.members.cache.random();

            const avatar = random.user.displayAvatarURL({
                format: 'png',
                size: 1024
            });

            const response = await fetch(avatar);
            const buffer = await response.buffer();

            await guild.setIcon(buffer);
            guild.channels.cache.get('756248300604358666').send(`Meow!!!!, picture van ${random.user.tag}`);
            
            console.log(`Server profile is geupdate naar ${random.user.tag} avatar`);
        } catch (error) {
            console.error(error);
        }
        
    }
})

client.login(config.token);
