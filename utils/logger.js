const { createLogger, format, transports } = require('winston');
const { combine, printf } = format;

const myFormat = printf(info => {
    const date = new Date();

    let options = {
        weekday: 'long',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'long'
    };

    let formatDate = new Intl.DateTimeFormat('ru-ru', options);
    formatDate = formatDate.format(date);

    return `${formatDate} [${info.level}]: ${info.message}`;
});

const logger = createLogger({
    format: combine(
        myFormat
    ),
    transports: [
        new transports.File({ filename: __base + '/logs/info.log', level: 'info' }),
        new transports.File({ filename: __base + '/logs/error.log', level: 'error' })
    ]
});

module.exports = logger;