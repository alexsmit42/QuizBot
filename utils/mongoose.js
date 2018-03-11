let mongoose = require('mongoose');
let config = require('config');

mongoose.Promise = global.Promise;
mongoose.connect(
    'mongodb://' + config.get('db.connection') + '/' + config.get('db.name')
).catch(err => {
    console.log(err);
});
module.exports = mongoose;