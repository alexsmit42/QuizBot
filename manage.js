let mongoose = require('./utils/mongoose');
let Question = require('./models/question');

let data = {
    _id: new mongoose.Types.ObjectId(),
    question: 'The capital of Poland',
    answers: [
        'Warsaw',
        'Gdansk',
        'Wroclaw',
        'Krakow'
    ],
    locale: 'en'
};
Question.create(data, function(err) {
    console.log(err)
});
