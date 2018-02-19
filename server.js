let botgram = require('botgram');
let config = require('config');
let utils = require('./utils');
let i18n = require('i18n');

/* DB */
require('./utils/mongoose');

let bot = botgram(config.get('token'));

bot.context({i18n: {}});


bot.all((msg, reply, next) => {
    if (!Object.keys(msg.context.i18n).length) {
        reply.command('set_locale');
    }

    // next();
});

bot.command('start', (msg, reply) => {

    reply.text(i18n.__('hello %s', msg.user.firstname));
});

bot.command('set_locale', (msg, reply) => {
    i18n.configure({
        locales:['en', 'ru'],
        defaultLocale: 'en',
        directory: __dirname + '/locale',
        extension: '.yml',
        syncFiles: true,
        updateFiles: true,
        register: msg.context.i18n
    });

    reply.text('Lang settings');
});

bot.command('question', (msg, reply, next) => {
    utils.getQuestion(msg.user.id, msg.context.locale, function(question) {
        if (question) {

            let answers = question.answers.map((answer, index) => {
                let callbackData = {
                    questionID: question._id,
                    isCorrect: "0"
                };

                if (index === 0) {
                    callbackData.isCorrect = "1";
                }

                return {
                    text: answer,
                    callback_data: JSON.stringify(callbackData)
                };
            });

            reply.inlineKeyboard([utils.shuffle(answers)]);
            reply.text(question.question);
        } else {
            // return ctx.sendMessage('question.not_found');
            reply.text('Not questions');
        }
    });
});

bot.callback((query, next) => {
    let data;
    try {
        data = JSON.parse(query.data);
    } catch (e) {
        return next();
    }

    bot.reply(query.from.id).text('Thanks, your answer is ' + (data.isCorrect === '1' ? 'correct' : 'not correct'));
});