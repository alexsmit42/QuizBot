process.env["NTBA_FIX_319"] = 1;

let bb = require('bot-brother');
let config = require('config');
let utils = require('./utils');

let token = config.get('token');
let bot = bb({
    key: config.get('token'),
    polling: {interval: 0, timeout: 10}
});

/* DB */
require('./utils/mongoose');
let Question = require('./models/question');

bot.use('before', function(ctx) {
    ctx.data.user = ctx.meta.user;
})
.use('before', bb.middlewares.typing())
.use('before', bb.middlewares.botanio(config.get('botanio')));

bot.command('start')
    .invoke(function(ctx) {
        return ctx.sendMessage('Witaj, <%=user.first_name%>!');
    });

bot.command('question')
    .invoke(function(ctx){
        Question.findOne()
            .then(res => {
                if (res) {
                    return ctx.sendMessage(`Вопрос найден`)
                } else {
                    return ctx.sendMessage(`Вопрос не найден`)
                }
            })
            .catch(err => {
                console.log(err);
            });
    });

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



