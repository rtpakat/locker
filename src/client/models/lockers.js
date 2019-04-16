const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const lockerSchema = new Schema({
    id: {
        type:String,
        required:true
    },
    name: {
        type:String,
        required:true
    },
    status: {
        type: String,
        required:true
    },
    size: {
        type:String,
        required:true
    }
});

module.exports = mongoose.model('Locker',lockerSchema);