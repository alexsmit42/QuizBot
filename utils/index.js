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
            });
        }).catch(err => {
            console.log(err);
        });
    }
};