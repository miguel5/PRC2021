var axios = require('axios');
var express = require('express');
var router = express.Router();
var gdb = require('../utils/graphdb')

/* GET home page. */
router.get('/filmes', async function(req, res) {
  var r = "?resultado"
  var myquery = `SELECT ?id ?titulo ?ano (count(distinct ?ator) as ?numAtores) WHERE {
    ?id a :Filme .
    ?id :title ?titulo .
    ?id :year ?ano .
    ?id :temAtor ?ator .
  }
  group by ?id ?titulo ?ano
  `
  var result = await gdb.execQuery(myquery);
  var dados = result.results.bindings.map(b =>{
    return {
      id: b.id.value.split('#')[1],
      titulo: b.titulo.value,
      ano: b.ano.value,
      numAtores: b.numAtores.value
    }
  })
  res.jsonp(dados)
});

router.get('/atores', async function(req, res) {
  var myquery = `SELECT distinct ?nome WHERE {
    ?s a :Filme .
    ?s :temAtor ?a .
    ?a :nome ?nome
  }
  order by ?nome
  `
  
  var result = await gdb.execQuery(myquery);

  var dados = result.results.bindings.map(b =>{
    return {
      nome: b.nome.value
    }
  })
  res.jsonp(dados)
});

router.get('/generos', async function(req, res) {
  var myquery = `SELECT distinct ?g WHERE {
    ?s a :Filme .
    ?s :temGenero ?g .
  }
  order by ?g
  `
  
  var result = await gdb.execQuery(myquery);

  var dados = result.results.bindings.map(b =>{
    return {
      genero: b.g.value.split('#')[1]
    }
  })
  res.jsonp(dados)
});

router.get('/filmes/:ano', async function(req, res) {
  var myquery = `SELECT DISTINCT ?s WHERE {
    ?s a ?Filme .
    ?s :year :${req.params.ano}^^xsd:int  .
  }
  `
  var filmes = [];
  var result = await gdb.execQuery(myquery);
  result.results.bindings.map(data =>{
    filmes.push(data.s.value.split('#')[1])
  })
  res.jsonp(filmes)
});


module.exports = router;
