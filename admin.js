let express = require('express');
let app = express();
let bodyParser = require('body-parser');

let utils = require('./utils');

/* BodyParser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/admin.html');
});

app.post('/save', function(req, res) {
    let question = req.body;

    utils.saveQuestion(question)
        .then(
            _id => {
                res.json({
                    success: true,
                    _id: _id
                });
            }
        );
});

app.post('/remove', function(req, res) {
    let _id = req.body._id;

    utils.removeQuestion(_id)
        .then((success) => {
            if (success) {
                res.json({
                    success: true
                });
            }
        })
});

app.get('/questions', utils.getQuestions);

let server = require('http').createServer(app);
server.listen(3000);