let Telegraf = require('telegraf');
let TelegrafI18n = require('telegraf-i18n');
let RedisSession = require('telegraf-session-redis');

const Markup = require('telegraf/markup');

let config = require('config');
let path = require('path');
let utils = require('./utils');

let bot = new Telegraf(config.get('token'));

const i18n = new TelegrafI18n({
    defaultLanguage: 'en',
    useSession: true,
    directory: path.resolve(__dirname, 'locales')
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


bot.catch((err) => {
    console.log('Ooops', err);
});

bot.start((ctx) => {
    const message = ctx.i18n.t('main.hello');
    return ctx.reply(message);
});

bot.command('language', (ctx) => {
    return ctx.reply(ctx.i18n.t('language.choose'),
        Markup.inlineKeyboard([
            Markup.callbackButton(ctx.i18n.t('language.en'), JSON.stringify({language: 'en'})),
            Markup.callbackButton(ctx.i18n.t('language.ru'), JSON.stringify({language: 'ru'}))
        ]).extra()
    );
});

bot.command('question', (ctx) => {
    utils.getQuestion(ctx.message.id, ctx.session.__language_code, function(question) {
        if (question) {
            let answers = question.answers.map((answer, index) => {
                let callbackData = {
                    question: question._id,
                    isCorrect: false
                };

                if (index === 0) {
                    callbackData.isCorrect = true;
                }

                return [Markup.callbackButton(answer, JSON.stringify(callbackData))];
            });

            return ctx.reply(question.caption,
                Markup.inlineKeyboard(utils.shuffle(answers)).extra()
            );
        } else {
            return ctx.reply(ctx.i18n.t('question.not'));
        }
    });
});

bot.on('callback_query', (ctx) => {
    let data = false;
    try {
        data = JSON.parse(ctx.update.callback_query.data);
    } catch (err) {
        console.log(err);
    }

    let message = '';
    if (data.question !== undefined) {
        let text = 'result.incorrect';
        if (data.isCorrect) {
            text = 'result.correct';
        }

        message = ctx.i18n.t(text);
    } else if (data.language !== undefined) {
        let newLanguage = data.language;
        ctx.i18n.locale(newLanguage);
        ctx.session.__language_code = newLanguage;

        message = ctx.i18n.t('language.changed');
    }

    return ctx.replyWithMarkdown(message);
});

bot.startPolling();