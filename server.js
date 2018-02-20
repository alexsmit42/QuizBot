let botgram = require('botgram');
let config = require('config');
let utils = require('./utils');
let i18n = require('i18n');

/* DB */
require('./utils/mongoose');

let bot = botgram(config.get('token'));

bot.context({
    i18n: {}
});
//
//
// bot.all((msg, reply, next) => {
//     if (!Object.keys(msg.context.i18n).length) {
//         reply.command('set_locale');
//     }
//
//     next();
// });

bot.command('start', (msg, reply) => {

    reply.text(`Привет, ${msg.user.firstname}!`);
    // reply.text(msg.context.i18n.__('hello %s', msg.user.firstname));
});

bot.command('locale', (msg, reply) => {
    let defaultLocale = 'en';
    if (!Object.keys(msg.context.i18n).length) {
        // defaultLocale = msg.context.i18n.getLocale();
    }

    i18n.configure({
        locales:['en', 'ru'],
        defaultLocale: defaultLocale,
        directory: __dirname + '/locale',
        extension: '.yml',
        syncFiles: true,
        updateFiles: true,
        register: msg.context.i18n
    });

    msg.context.i18n = i18n;
    console.log(msg);

    let keyboard = [
        {
            text: msg.context.i18n.__('RU'),
            callback_data: JSON.stringify({
                newLanguage: 'ru'
            })
        },
        {
            text: msg.context.i18n.__('EN'),
            callback_data: JSON.stringify({
                newLanguage: 'en'
            })
        }
    ];
    reply.inlineKeyboard([keyboard]);

    reply.text(msg.context.i18n.__('Language setting'));
});

bot.command('question', (msg, reply, next) => {
    utils.getQuestion(msg.user.id, 'en', function(question) {
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
            // reply.text(msg.context.i18n.__('Not questions'));
            reply.text('No questions');
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

    if (data.questionID !== undefined) {
        utils.setLog(query.message.user.id, data.questionID, data.isCorrect === '1');

        bot.reply(query.from.id).text('Thanks, your answer is ' + (data.isCorrect === '1' ? 'correct' : 'not correct'));
    } else if (data.newLanguage !== undefined) {
        bot.reply(query.from.id).text('Language changed');
    }

});