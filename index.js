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
  .then(animal => res.status(200).json(animal))
  .catch(error => res.status(500).json(error))
})




const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});



