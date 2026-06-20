require('dotenv').config();
const { App } = require('@slack/bolt');

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
});

app.command('/ping', async ({ command, ack, respond }) => {
    await ack();
    const latency = Date.now() - Math.floor(command.ts * 1000);
    await respond(`Pong! Latency: ${latency}ms`);
});

app.command('/help', async ({ ack, respond }) => {
    await ack();
    await respond([
        'Slack Bot Help',
        '',
        '/ping - Check latency',
        '/help - Show this message',
        '/joke - Get a random joke',
        '/qotd - Get a random quote',
    ].join('\n'));
});

app.command('/joke', async ({ ack, respond }) => {
    await ack();
    const jokes = [
        { s: 'Why do programmers prefer dark mode?', p: 'Because light attracts bugs!' },
        { s: 'Why did the developer go broke?', p: 'Because he used up all his cache!' },
        { s: 'What is a programmer\'s favorite hangout?', p: 'Foo Bar!' },
    ];
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    await respond(`${joke.s} ${joke.p}`);
});

app.command('/qotd', async ({ ack, respond }) => {
    await ack();
    const quotes = [
        { s: 'The only way to do great work is to love what you do.', p: 'Steve Jobs' },
        { s: 'Success is not the key to happiness. Happiness is the key to success.', p: 'Albert Schweitzer' },
        { s: 'In the middle of every difficulty lies opportunity.', p: 'Albert Einstein' },
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    await respond(`"${quote.s}" - ${quote.p}`);
});

app.event('app_mention', async ({ event, say }) => {
    await say(`Hello <@${event.user}>! How can I assist you today?`);
});

(async () => {
    await app.start(process.env.PORT || 3000);
    console.log('Slack Bolt app is running!');
})();
