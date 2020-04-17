const mongoose = require('mongoose')
mongoose.Promise = global.Promise;

const uri = process.env.MONGODB_URI || 'mongodb://admin:fabulous1@ds011873.mlab.com:11873/heroku_hcmnpqbm'

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }).then(
    () => {
        console.log('======= yeehaw! connected to mongo =======');
    },
    err => {
        console.log('======= error connecting to mongo:');
        console.log(err)
        }
);
    
module.exports = mongoose.connection;