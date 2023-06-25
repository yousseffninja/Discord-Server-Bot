require('dotenv/config');

const { Client, IntentsBitField } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({

    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})

const confuguration = new Configuration({
    apiKey: process.env.API_KEY,
});

const openAI = new OpenAIApi(confuguration);

client.on('ready', ()=> {
    console.log('Bot is ready');
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.channel.id !== process.env.CHANNEL_ID) return;
    if(message.content.startsWith('!')) return;

    let conversationLog = [{ role: 'system', content: "you are a friendly chat bot" }];

    conversationLog.push({
        role: 'user',
        content: message.content,
    })

    await message.channel.sendTyping();

    let prevMessage = await message.channel.messages.fetch({ limit: 15 });
    prevMessage.reverse();

    prevMessage.forEach((msg) => {
        if (message.content.startsWith('!')) return;
        if (msg.author.id !== client.user.id && message.author.bot) return;
        if (msg.author.id !== message.author.id) return;
    });

    const result  = await openAI.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
    })

    message.reply(result.data.choices[0].message);
});

client.login(process.env.TOKEN)

//