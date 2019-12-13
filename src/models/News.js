const mongoose = require('mongoose')


const Schema = mongoose.Schema

const NewsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    summary: {
        type: String
    },

    tag: {
        type: Number
    },
    detail: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = News = mongoose.model('news',NewsSchema)
