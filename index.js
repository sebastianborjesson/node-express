require('dotenv').config();
const express = require('express');
const Person = require('./models/person');
const app = express();

app.use(express.json())

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => {
            console.log(error);
            response.status(400).send({ error: 'malformatted id' });
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end();
        })
})


app.post('/api/persons', (request, response) => {
    const body = request.body;
    if(body === undefined) {
        return response.status(400).json({
            error: 'Content missing!'
        });
    }
    if(!body.name) {
        return response.status(400).json({error: 'Name is missing'})
    }
    if(!body.number) {
        return response.status(400).json({error: 'Number is missing!'})
    }

    const person = new Person({
        name: body.name,
        number: body.number 
    });

    person.save().then(savedPerson => {
        response.json(savedPerson);
    })
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new:true})
    .then(updatedPerson => {
        response.json(updatedPerson);
    })
})

app.get('/api/info', (request, response) => {
    response.send('<p>Phonebook has info for ' + persons.length + ' people</p>\n' + '<p>' + new Date() + '</p>');
    response.send();
});
  
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})