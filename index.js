const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')



app.use(bodyParser.json())

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



let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Martti Tienari",
        number: "040-123456",
        id: 2
    },
    {
        name: "Arto Järvinen",
        number: "040-123456",
        id: 3
    },
    {
        name: "Lea Kutvonen",
        number: "040-123456",
        id: 4
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const count = persons.length
    const date = new Date()

    res.send(`<p>Puhelinluettelossa ${count} henkilön tiedot.</p><p>${date}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        res.json(person)
    } else {
        res.status(404).end()
    }    
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    const newId = Math.floor(Math.random() * (persons.length - 600) + 600)

    if (body.name === undefined || body.number === undefined) {
        return res.status(400).json({ error: 'Missing name or number' })
    }

    if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({ error: 'Name must be unique' })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: newId
    }

    persons = persons.concat(person)
    res.json(person)
})

const PORT = 3002
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})