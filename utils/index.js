let mongoose = require('../utils/mongoose');
let Log = require('../models/log');
let Question = require('../models/question');

module.exports = {

    saveQuestion(question) {

        let _id= question.id;
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
            Question.create(data, function(err) {
                if (!err) {
                    resolve('Ok!');
                } else {
                    reject(new Error(err));
                }
            })
        });
    },

    getQuestion(user, locale, callback) {
        // Log.find({
        //     user: user
        // }).then(logs => {
        //     logs = logs || [];
        //
        //     logs = logs.map(log => log.question);
        //     Question.findOne({
        //         locale: locale,
        //         _id: {$nin: logs}
        //     }).then(question => {
        //         callback(question);
        //     }).catch(err => {
        //         console.log(err);
        //     });
        // }).catch(err => {
        //     console.log(err);
        // });
        Question.findOne({
            locale: locale
        }).then(question => {
            callback(question);
        }).catch(err => {
            console.log(err);
        });
    },

    getQuestions(req, res){
        Question.find().then(questions => {
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

    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
};