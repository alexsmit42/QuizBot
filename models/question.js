let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let QuestionSchema = Schema({
    _id: Schema.Types.ObjectId,
    caption: {
        type: String,
        required: true
    },
    answers: {
        type: Array,
        required: true
    },
    locale: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Question', QuestionSchema);
