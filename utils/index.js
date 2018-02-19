let Log = require('../models/log');
let Question = require('../models/question');

module.exports = {

    getQuestion(user, locale, callback) {
        Log.find({
            user: user
        }).then(logs => {
            logs = logs || [];

            logs = logs.map(log => log.question._id);
            Question.findOne({
                locale: locale,
                _id: {$nin: logs}
            }).then(question => {
                callback(question);
            }).catch(err => {

            });
        }).catch(err => {
            // console.log(err);
        });
    },

    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
};