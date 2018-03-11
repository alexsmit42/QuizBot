let mongoose = require('../utils/mongoose');
let Log = require('../models/log');
let Question = require('../models/question');

module.exports = {

    saveQuestion(question) {

        let _id = question._id;
        if (!_id) {
            _id = new mongoose.Types.ObjectId()
        }

        let data = {
            _id: _id,
            caption: question.caption,
            answers: question.answers,
            locale: question.locale
        };

        return new Promise((resolve, reject) => {
            Question.update({_id: _id}, data, {upsert: true, setDefaultsOnInsert: true}, function(err) {
                if (!err) {
                    resolve('Ok!');
                } else {
                    reject(new Error(err));
                }
            });
        });
    },

    removeQuestion(_id) {

        return new Promise((resolve, reject) => {
            Question.deleteOne({_id: _id}, function(err){
                if (!err) {
                    resolve(true);
                } else {
                    reject(new Error(err));
                }
            });
        });
    },

    getQuestion(user, locale, callback) {
        Log.find({
            user: user
        }).then(
            logs => {
            logs = logs || [];

            logs = logs.map(log => log.question);
            Question.findOne({
                locale: locale,
                _id: {$nin: logs}
            }).then(question => {
                callback(question);
            });
            },
            err => {
                console.log(err);
            }
        );
    },

    getQuestions(req, res){
        Question.find().sort('-createDate').then(questions => {
            res.json({
                success: true,
                questions: questions
            });
        });
    },

    setLog(user, question, isCorrectly) {
        let params = {user, question, isCorrectly};
        params._id = new mongoose.Types.ObjectId();

        let log = new Log(params);
        log.save();
    },

    getScore(user) {
        return new Promise((resolve) => {
            Log.find({user: user})
                .populate('question')
                .exec()
                .then(
                    logs => {
                        if (!logs.length) {
                            resolve(false);
                        }

                        let counts = {};
                        logs.forEach(function(log) {
                            let locale = log.question.locale;

                            counts[locale] = counts[locale] || {'isCorrect': 0, 'total': 0};

                            counts[locale].isCorrect += +log.isCorrectly;
                            counts[locale].total++;
                        });

                        resolve(counts);
                    }
                );
        });
    },

    getTop() {
        return Log.aggregate([
            {
                $group: {
                    _id: '$user',
                    count: {$sum: 1}
                },
            },
            {
                $sort: {
                    count: -1
                }
            }
        ]);
    },

    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
};