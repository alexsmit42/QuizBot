let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let LogShema = Schema({
    _id: Schema.Types.ObjectId,
    user: {
        type: Number,
        required: true
    },
    logDate: {
        type: Date,
        default: Date.now
    },
    isCorrectly: {
        type: Boolean,
        default: false
    },
    question: {
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }
});

module.exports = mongoose.model('Log', LogShema);