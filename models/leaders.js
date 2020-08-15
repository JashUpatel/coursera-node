const mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const leaderSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required:true
    },
    designation:{
        type:String,
        required: true
    },
    abbr:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required: true
    },
    featured:{
        type: Boolean,
        required: true,
        default: false
    }

},{
    timestamps:true
});

var Leaders = mongoose.model('leader', leaderSchema);

module.exports = Leaders;