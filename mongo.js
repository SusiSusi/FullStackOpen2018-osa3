const mongoose = require('mongoose')

const url = 'mongodb://puhu:luettelo@ds139690.mlab.com:39690/puhelinluettelo'

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    phone: String
})

if (process.argv.length === 4) {
    const person = new Person ({
        name: process.argv[2],
        phone: process.argv[3]
    })

    person
        .save()
            .then(response => {
                console.log(`Lisätään henkilö ${process.argv[2]} numero ${process.argv[3]} luetteloon.`)
                mongoose.connection.close()
            })
}

if(process.argv.length === 2) {
    Person
        .find({ })
        .then(result => {
            console.log('Puhelinluettelo:')
                result.forEach(person => {
                    console.log(`${person.name} ${person.phone}`)
                })
            mongoose.connection.close()
        })
}
