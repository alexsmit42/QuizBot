let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let QuestionSchema = Schema({
    _id: Schema.Types.ObjectId,
    question: {
        type: String,
        required: true
    },
    answers: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('Question', QuestionSchema);
