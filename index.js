const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const server = express();

server.use(express.json());
server.use(helmet());


const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
      filename: './data/lambda.sqlite3'
  },
  debug: true
}

const db = knex(knexConfig)

// endpoints here

server.get('/api/zoo', (req, res) => {
  db('zoos')
  .then(animals => res.status(200).json(animals))
  .catch(error => res.status(500).json(error))
})

server.get('/api/zoo/:id', (req, res) => {
  const id = req.params.id

  db('zoos')
  .where({id})
  .first()
  .then(animal => {
    if(!animal) {
      res
      .status(404)
      .json({message: `Animal with the specified ID of ${id} does not exist.`})
    } else {
      res.json(animal)
    }
  })
  .catch(error => res.status(500).json(error))
})

server.post('/api/zoo', (req, res) => {
  const zoo = req.body
  if(!zoo.name) {
        res
            .status(403)
            .json({message: "You need to fill out necessary field(s) ('name')."})
      } else {
  db('zoos')
  .insert(zoo)
  .then(ids => {
    const id = ids[0]
    db('zoos')
    .where({id})
    .first()
    .then(zoos => res.status(201).json(zoos))
    
  })
  .catch(error => {
    res
    .status(500)
    .json({message: "There was an error while saving to the database"})
  })
}
})




const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});



