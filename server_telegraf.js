let Telegraf = require('telegraf');
let TelegrafI18n = require('telegraf-i18n');
let RedisSession = require('telegraf-session-redis');

const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

let config = require('config');
let path = require('path');

let bot = new Telegraf(config.get('token'));

const i18n = new TelegrafI18n({
    defaultLanguage: 'en',
    allowMissing: true,
    useSession: true,
    directory: path.resolve(__dirname, 'locale')
});

const session = new RedisSession({
    store: {
        host: config.get('redis.host'),
        port: config.get('redis.port'),
        db: config.get('redis.db')
    }
});

bot.use(session.middleware());
bot.use(i18n.middleware());

bot.use((ctx, next) => {
    next();
});

bot.start((ctx) => {
    const message = ctx.i18n.t('main.hello');
    return ctx.reply(message);
});

bot.command('question', (ctx) => {
    return ctx.reply('Вопрос',
        Markup.inlineKeyboard([
            [Markup.callbackButton('Ответ 1', 1)],
            [Markup.callbackButton('Ответ 2', 2)],
            [Markup.callbackButton('Ответ 3', 3)]
        ]).extra()
    );
});

bot.on('callback_query', (ctx) => {
    return ctx.reply('Your answer!');
});


bot.startPolling();