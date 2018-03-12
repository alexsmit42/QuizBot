let mongoose = require('mongoose');
let config = require('config');
let logger = require('./logger');

mongoose.Promise = global.Promise;
mongoose.connect(
    config.get('db.connection') + '/' + config.get('db.name')
).catch(err => {
    logger.error(err);
});
module.exports = mongoose;