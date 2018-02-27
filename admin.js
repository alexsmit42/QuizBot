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
        .then((msg) => {
            res.json({
                'success': true
            });
        });
});

let server = require('http').createServer(app);
server.listen(3000);