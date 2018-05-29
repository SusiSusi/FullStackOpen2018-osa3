const mongoose = require('mongoose')

const url = 'mongodb://puhu:luettelo@ds139690.mlab.com:39690/puhelinluettelo'

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