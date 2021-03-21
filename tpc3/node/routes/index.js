var express = require('express');
var axios = require('axios')
var router = express.Router();

/* GraphDB server IP:port
   Change to 'localhost:7200' if running locally
*/
var serverIP = 'http://192.168.1.243:7200/'

var prefixes = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX noInferences: <http://www.ontotext.com/explicit>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX adv: <http://www.di.uminho.pt/prc2021/Charada#>
    PREFIX : <http://www.di.uminho.pt/prc2021/Charada#>
`

var baseLink = serverIP + 'repositories/' 

/* GET home page. */
router.get('/', function(req, res) {
  axios.get(serverIP + 'rest/repositories')
    .then(dados => res.render('index', {repos:dados.data}))
    .catch(erro => console.log(erro))
});

router.get('/repos/:r', function(req, res) {
  var getLink = baseLink + req.params.r + '?query='
  var query = `SELECT * WHERE { ?s a owl:Class .}`
  var encoded = encodeURIComponent(prefixes + query)
  
  axios.get(getLink + encoded)
    .then(dados => {
      var classes = []
      dados.data.results.bindings.map(bind =>
        classes.push(bind.s.value.split('#')[1]))
      res.render('repositorio', {repos:req.params.r, classes:classes})
    })
    .catch(error => console.log(error))
});

router.get('/repos/:r/classe/:c', function(req, res) {
  var getLink = baseLink + req.params.r + '?query='
  var query = `SELECT * WHERE { :${req.params.c} ?p ?o .}`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados => {
      var individuos = []
      dados.data.results.bindings.map(bind =>
        individuos.push(bind.s.value.split('#')[1]))
      res.render('classe', {repos:req.params.r, classe:req.params.c, individuos:individuos})
    })
    .catch(error => console.log(error))
});


router.get('/repos/:r/individuo/:i', function(req, res){
  var getLink = baseLink + req.params.r + '?query='
  var query = `SELECT * WHERE { ?s rdf:type :${req.params.c} .}`
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(getLink + encoded)
    .then(dados => {
      var props = []
      dados.data.results.bindings.map(bind =>
        props.push(bind.s.value.split('#')[1]))
      res.render('individuo', {repos:req.params.r, classe:req.params.c, individuos:individuos})
    })
    .catch(error => console.log(error))
})


module.exports = router;
