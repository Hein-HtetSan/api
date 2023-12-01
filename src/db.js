const mongoose = require('mongoose');

module.exports = {
    connect: DB_HOST => {
        //Use the mongo driver's updated url string parser
        mongoose.set('useNewUrlParser', true);
        //use findOneAndUpdate() in place of findAndModify()
        mongoose.set('useFindAndModify', false);
        //use createIndex() in place of ensureIndex()
        mongoose.set('useCreateIndex', true);
        // connect ot the DB
        mongoose.connect(DB_HOST);
        //log an error if we fail to connect
        mongoose.connection.on('error', err => {
            console.log(err);
            console.log('MongoDB Connection error. Please make sure MongoDB is running');
            process.exit();
        });
    },
    close: () => {
        mongoose.connections.close();
    }
}