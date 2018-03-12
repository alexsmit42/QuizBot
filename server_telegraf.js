global.__base = __dirname;

let Telegraf = require('telegraf');
let TelegrafI18n = require('telegraf-i18n');
let RedisSession = require('telegraf-session-redis');

const Markup = require('telegraf/markup');
const Telegram = require('telegraf/telegram');

let config = require('config');
let path = require('path');
let utils = require('./utils');
let logger = require('./utils/logger');

let bot = new Telegraf(config.get('token'));
let telegram = new Telegram(config.get('token'));

const i18n = new TelegrafI18n({
    defaultLanguage: 'ru',
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
    utils.getQuestion(ctx.from.id, ctx.session.__language_code, function(question) {
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

bot.command('myscore', (ctx) => {
    utils.getScore(ctx.from.id).then(
        score => {
            if (!score) {
                return ctx.reply('score.no_play');
            }

            let messages = [];
            let totalScore = {isCorrect: 0, total: 0};
            for (let locale in score) {
                messages.push(ctx.i18n.t('score.locale.' + locale) + ': ' + ctx.i18n.t('score.counts', score[locale]));
                totalScore.isCorrect += score[locale].isCorrect;
                totalScore.total += score[locale].total;
            }
            messages.unshift(ctx.i18n.t('score.locale.all') + ': ' + ctx.i18n.t('score.counts', totalScore));

            return ctx.replyWithHTML(messages.join('\n'));
        }
    );

    logger.info(`User ${ctx.from.id} looked score`);
});

bot.command('top', (ctx) => {
   utils.getTop()
       .then(top => {
           const members = top.map(async (user) => {
               return {
                   count: user.count,
                   member: await telegram.getChatMember(ctx.chat.id, user._id)
               }
           });

           Promise.all(members).then(
               members => {
                   let messages = [];
                   messages.push(ctx.i18n.t('top.title') + '\n');

                   members.forEach((member, index) => {
                       messages.push(`${index + 1}. ${member.member.user.first_name} ${member.member.user.last_name} - ${ctx.i18n.t('top.count', {count: member.count})}`);
                   });

                   return ctx.replyWithHTML(messages.join('\n'));
               }
           );
       });

    logger.info(`User ${ctx.from.id} looked top`);
});

bot.on('callback_query', (ctx) => {
    let data = false;
    try {
        data = JSON.parse(ctx.update.callback_query.data);
    } catch (err) {
        console.log(err);
    }

    let user = ctx.from.id;

    (async() => {
        let message = '';
        if (data.question !== undefined) {
            let isPlayedQuestion = await utils.isPlayedQuestion(user, data.question);

            let text = 'question.played';

            if (!isPlayedQuestion) {
                text = 'result.incorrect';
                if (data.isCorrect) {
                    text = 'result.correct';
                }

                utils.setLog(user, data.question, data.isCorrect);
            }

            message = ctx.i18n.t(text);

        } else if (data.language !== undefined) {
            let newLanguage = data.language;
            ctx.i18n.locale(newLanguage);
            ctx.session.__language_code = newLanguage;

            message = ctx.i18n.t('language.changed');
        }

        return ctx.replyWithMarkdown(message);
    })();
});

bot.startPolling();