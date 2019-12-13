const mongoose = require('mongoose')


const Schema = mongoose.Schema


// Create Schema
const ScenicspotSchema = new Schema({
    name: {
        type: String
    },
    localtion: {
        type: String
    },
    project: [{
        id: {
            type: String
        },
        name: {
            type: String
        },
        url: {
            type: Array
        },
        openinghours: {
            type: String
        },
        like: {
            type: Number
        },
        screamindex: {
            type: Number
        },
        category: {
            type: String
        },
        introduction: {
            type: String
        },
        indentity: {
            type: String
        },
        affiliatedpark: {
            type: String
        },
        suitableforthcrowd: {
            type: String
        },
        remarks: {
            type: String
        }
    }]

})

module.exports = Scenicspot = mongoose.model('Scenicspots', ScenicspotSchema)
