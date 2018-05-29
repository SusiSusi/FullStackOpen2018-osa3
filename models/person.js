const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
mongoose.Promise = global.Promise

const personSchema = new mongoose.Schema({
    name: String,
    phone: String
})

personSchema.statics.format = ({ name, phone, _id }) => {
    return {
        name: name,
        phone: phone,
        id: _id
    }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person