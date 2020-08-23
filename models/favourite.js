const mongoose = require('mongoose');
// const Dishes = require('./dishes');
// const Schema =  mongoose.Schema;

const favouriteSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]
},{
    timestamps: true
});

const Favourite = mongoose.model('Favourite', favouriteSchema);

module.exports = Favourite;