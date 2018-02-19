process.env["NTBA_FIX_319"] = 1;

let bb = require('bot-brother');
let config = require('config');
let utils = require('./utils');
let texts = require('./texts');

/* DB */
require('./utils/mongoose');

let token = config.get('token');
let bot = bb({
    key: config.get('token'),
    sessionManager: bb.sessionManager.redis(config.get('redis')),
    polling: {interval: 0, timeout: 1}
})
.texts(texts.ru, {locale: 'ru'})
.texts(texts.en, {locale: 'en'})
.texts(texts.default)
.use('before', bb.middlewares.typing())
.use('before', bb.middlewares.botanio(config.get('botanio')))
.use('before', function(ctx){
    ctx.data.user = ctx.meta.user;

    ctx.session.createDate = ctx.session.createDate || Date.now();

    ctx.setLocale(ctx.session.locale || config.get('defaults.locale'));

    if (!/^setting_locale/.test(ctx.command.name) && !ctx.session.locale) {
        return ctx.go('setting_locale');
    }
});

bot.command('start')
    .invoke(ctx => {
        return ctx.sendMessage('main.hello');
    });

bot.command('question')
    .invoke(ctx => {
        utils.getQuestion(ctx.meta.user.id, ctx.session.locale, function(question) {
            if (question) {
                let answers = [];
                question.answers.forEach((answer, index) => {
                    let callbackData = {
                        isCorrect: false
                    };

                    if (index === 0) {
                        callbackData.isCorrect = true;
                    }

                    answers.push({ [answer]: callbackData });
                });

                ctx.keyboard([
                    utils.shuffle(answers)
                ]);

                return ctx.sendMessage(question.question);
            } else {
                return ctx.sendMessage('question.not_found');
            }
        });
    })
    .callback(ctx => {
        // console.log(ctx);
    });

bot.command('question_i')
    .invoke(ctx => {
        utils.getQuestion(ctx.meta.user.id, ctx.session.locale, function(question) {
            if (question) {
                let answers = [];
                question.answers.forEach((answer, index) => {
                    let callbackData = {
                        isCorrect: false
                    };

                    if (index === 0) {
                        callbackData.isCorrect = true;
                    }

                    answers.push({ [answer]: callbackData });
                });

                ctx.inlineKeyboard([
                    utils.shuffle(answers)
                ]);

                return ctx.sendMessage(question.question);
            } else {
                return ctx.sendMessage('question.not_found');
            }
        });
    })
    .callback(ctx => {
        // console.log(ctx);
    });

bot.command('setting_locale')
    .invoke(function(ctx) {
        return ctx.sendMessage('settings.locale');
    })
    .answer(function(ctx){
        ctx.session.locale = ctx.answer;
        ctx.setLocale(ctx.answer);
        return ctx.sendMessage('settings.locale_success').then(function() {
            return ctx.goBack();
        });
    })
    .keyboard([
        [
            {'buttons.en': 'en'},
            {'buttons.ru': 'ru'}
        ]
    ]);

// bot.onText(/\/start/, (msg) => {
//     bot.sendMessage(msg.chat.id, `Witaj, ${msg.from.id}!`);
// });
//
// bot.onText(/\/question/, (msg) => {
//     Question.findOne()
//         .then(res => {
//             if (res) {
//                 bot.sendMessage(msg.chat.id, 'Вопрос найден');
//             } else {
//                 bot.sendMessage(msg.chat.id, 'Вопрос не найден');
//             }
//         })
//         .catch(err => {
//             console.log(err);
//         });
// });



