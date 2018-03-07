let mongoose = require('./utils/mongoose');
let Question = require('./models/question');

let data = {
    _id: new mongoose.Types.ObjectId(),
    caption: 'Столица Польши',
    answers: [
        'Варшава',
        'Гданьск',
        'Вроцлав',
        'Краков'
    ],
    locale: 'ru'
};
Question.create(data, function() {
    console.log(111)
});
