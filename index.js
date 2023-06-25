require('dotenv/config');
const { Client, Intents } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({
    intents: [
        Intents.FLAGS.Guilds,
        Intents.FLAGS.GuildMessages,
        Intents.FLAGS.MessageContent,
    ],
});

const configuration = new Configuration({
    apiKey: process.env.API_KEY,
});

const openAI = new OpenAIApi(configuration);

client.on('ready', () => {
    console.log('Bot is ready');
});

client.on('messageCreate', async (message) => {
    // Rest of your message handling code

    // ...
});

// Export the client after attaching event listeners
module.exports = client;

// Start the bot by logging in
client.login(process.env.TOKEN);
