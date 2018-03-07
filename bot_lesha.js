let Telegraf = require('telegraf');

let bot = new Telegraf('535092919:AAFJGvpMRFjAQgLic9OiVL2ph6Toqqc201I');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

bot.start((ctx) => {
    return ctx.reply('Привет! Я очень умный бот Леша! Пообщайся со мной');
});

bot.on('text', (ctx) => {
    let text = ctx.message.text;

    if (text.indexOf('?') !== -1) {
        if (text.indexOf('шь') !== -1) {
            switch(getRandomInt(3)) {
                case 0:
                    ctx.reply('Дя');
                    break;
                case 1:
                    ctx.reply('Неть');
                    break;
                case 2:
                    ctx.replyWithSticker('CAADAgADCQADwnXFCS-oF_aLnHaPAg');
                    break;
            }
        } else {
            ctx.replyWithSticker('CAADAgADCQADwnXFCS-oF_aLnHaPAg');
        }

    } else {
        if (text.toLowerCase() === 'пока') {
            ctx.reply('Покя');
        } else if (text.split(' ').length === 1) {
            ctx.reply(`Ууу, ${text}, уууу сука`);
        } else {
            switch(getRandomInt(3)) {
                case 0:
                    ctx.reply('Пащиму');
                    break;
                case 1:
                    ctx.reply('Карашо');
                    break;
                case 2:
                    ctx.reply('Ну ладн');
                    break;
            }
        }
    }
});

bot.startPolling();