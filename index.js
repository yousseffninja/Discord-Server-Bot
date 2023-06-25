require('dotenv/config');
const { Client, Intents } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.MESSAGE_CONTENTS,
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
    if (message.author.bot) return;
    if (message.channel.id !== process.env.CHANNEL_ID) return;
    if (message.content.startsWith('!')) return;

    let conversationLog = [{ role: 'system', content: "you are a friendly chat bot" }];

    conversationLog.push({
        role: 'user',
        content: message.content,
    });

    await message.channel.sendTyping();

    let prevMessages = await message.channel.messages.fetch({ limit: 15 });
    prevMessages = prevMessages.array().reverse();

    prevMessages.forEach((msg) => {
        if (msg.content.startsWith('!')) return;
        if (msg.author.id !== client.user.id && msg.author.bot) return;
        if (msg.author.id !== message.author.id) return;
        conversationLog.push({
            role: 'user',
            content: msg.content,
        });
    });

    const result = await openAI.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
    });

    message.reply(result.data.choices[0].message.content);
});

client.login(process.env.TOKEN);

module.exports = client;
