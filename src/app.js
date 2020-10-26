const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


function validadeRepositoryId(req, res, next ) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json( { error: 'Invalid repository id.' } )
  }

  return next();
}




app.get("/repositories", (request, response) => {

 return response.json(repositories);

});




app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
     id: uuid(),
     title,
     url,
     techs,
     likes: 0
  }

  repositories.push(repository);
  return response.status(201).json(repository);
});



app.put("/repositories/:id", validadeRepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = repositories.findIndex( r => r.id == id);
  if ( index < 0 ) return response.status(400).json( { error: 'Repository not found.' } );
  var repositoryBanco = repositories[index];
 
  repositoryBanco.title = title;
  repositoryBanco.url = url;
  repositoryBanco.techs = techs;

  repositories[index] = repositoryBanco;

  return response.status(200).json(repositoryBanco);
});




app.delete("/repositories/:id", validadeRepositoryId, (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex( r => r.id == id);
  if ( index < 0 ) return response.status(400).json( { error: 'Repository not found.' } );

  repositories.splice(index, 1);

  return response.status(204).send();
});




app.post("/repositories/:id/like", validadeRepositoryId, (request, response) => {
    const { id } = request.params;

    const index = repositories.findIndex( r => r.id == id);
    if ( index < 0 ) return response.status(400).json( { error: 'Repository not found.' } );
    var repositoryBanco = repositories[index];
     
    repositoryBanco.likes ++;
    repositories[index] = repositoryBanco;

   return response.json(repositoryBanco);
});

module.exports = app;
