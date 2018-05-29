const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

app.use(morgan( (tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      JSON.stringify(req.body),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
  }))

/*app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})*/

/*const formatPerson = (person) => {
    return {
        name: person.name,
        phone: person.phone,
        id: person._id
    }
}*/

app.get('/api/persons', (req, res) => {
    Person
        .find({ })
        .then(persons => {
            res.json(persons.map(Person.format))
        })
})

app.get('/info', (req, res) => {
    const date = new Date()

    Person
        .find({ })
        .then(persons => {
            res.send(`<p>Puhelinluettelossa ${persons.length} henkilön tiedot.</p><p>${date}</p>`)
        })
        .catch(error => {
            console.log(error)
        })
})

app.get('/api/persons/:id', (req, res) => {
    Person
        .findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(Person.format(person))
            } else {
                response.status(404).end()
            }
        })  
        .catch(error => {
            console.log(error)
            response.status(400).send({ error: 'malformatted id' })
          })
})

app.delete('/api/persons/:id', (req, res) => {
    Person
        .findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            res.status(404).send({ error: 'malformatted id' })
        })
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    /*const newId = Math.floor(Math.random() * (persons.length - 600) + 600)*/

    if (body.name === "" || body.phone === "") {
        return res.status(400).json({ error: 'Missing name or number' })
    }

    if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({ error: 'Name must be unique' })
    }

    Person 
        .find({ name: body.name })
        .then(result => {
            if (result.length !== 0) {
                return res.status(400).json({ error: 'Name must be unique' })
            } else {
                const person = new Person ({
                    name: body.name, 
                    phone: body.phone
                })

                person
                    .save()
                    .then(Person.format)
                    .then(savedAndFormattedPerson => {
                        res.json(savedAndFormattedPerson)
                     })
                    .catch(error => {
                        console.log(error)
                    })
            }
            
        })
})

app.put('/api/persons/:id', (req, res) => {
    const body = req.body

    const person = {
        name: body.name,
        phone: body.phone
    }

    Person
        .findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(Person.format(updatedPerson))
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ error: 'malformatted id' })
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})