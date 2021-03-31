var express = require('express');
var axios = require('axios')
var router = express.Router();

/* GraphDB server IP:port
   Change to 'localhost:7200' if running locally
*/
var serverIP = 'http://localhost:7200/'

var prefixes = `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX noInferences: <http://www.ontotext.com/explicit>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX : <http://www.daml.org/2003/01/periodictable/PeriodicTable#>
`

var baseLink = serverIP + 'repositories/tabela-periodica?query=' 

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index')
});

router.get('/elements', function(req, res) {
  var query = `SELECT * WHERE { ?s a :Element .
              OPTIONAL {?e :name ?name .}
              OPTIONAL {?e :group ?group .}
              OPTIONAL {?e :period ?period .} }
              ORDER BY (?e)`

  var encoded = encodeURIComponent(prefixes + query)
  
  axios.get(baseLink + encoded)
    .then(dados => {
      var elements = []
      dados.data.results.bindings.map(bind =>{
        var name = ""
        var group = ""
        var period = ""
        if(bind.name) name = bind.name.value
        if(bind.group) group = bind.group.value.split('#')[1]
        if(bind.period) period = bind.period.value.split('#')[1]
        elements.push([bind.e.value.split('#')[1], name, group, period])
      })
      res.render('elements', {elements:elements})
    })
    .catch(error => console.log(error))
});

router.get('/elements/:e', function(req, res) {
  var query = `SELECT * WHERE {
              OPTIONAL {:${req.params.e} :name ?name .} 
              OPTIONAL {:${req.params.e} :group ?group .} 
              OPTIONAL {:${req.params.e} :period ?period .} 
              OPTIONAL {:${req.params.e} :atomicNumber ?atomicNumber .}
              OPTIONAL {:${req.params.e} :atomicWeight ?atomicWeight .} 
              OPTIONAL {:${req.params.e} :classification ?classification .} 
              OPTIONAL {:${req.params.e} :color ?color .} 
              OPTIONAL {:${req.params.e} :standardState ?standardState .} }`

  var encoded = encodeURIComponent(prefixes + query)

  axios.get(baseLink + encoded)
    .then(dados => {
      var element = []
      dados.data.results.bindings.map(bind =>{
        var name = ""
        var group = ""
        var period = ""
        var atomicNumber = ""
        var atomicWeight = ""
        var classification = ""
        var color = ""
        var standardState = ""
        if (bind.name){
          name = bind.name.value
          element.push(["name", name])
        }
        if (bind.group){
          group = bind.group.value.split('#')[1]
          element.push(["group", group])
        }
        if (bind.period){
          period = bind.period.value.split('#')[1]
          element.push(["period", period])
        }
        if (bind.atomicNumber){
          atomicNumber = bind.atomicNumber.value
          element.push(["atomic number", atomicNumber])
        }
        if (bind.atomicWeight){
          atomicWeight = bind.atomicWeight.value
          element.push(["atomic weight", atomicWeight])
        }
        if (bind.classification){
          classification = bind.classification.value.split('#')[1]
          element.push(["classification", classification])
        }
        if (bind.color){
          color = bind.color.value
          element.push(["color", color])
        }
        if (bind.standardState){
          standardState = bind.standardState.value.split('#')[1]
          element.push(["standard state", standardState])
        }
      })
      res.render('element', {id:req.params.e, element:element})
    })
    .catch(erro => console.log(erro))
})


router.get('/groups', function(req, res) {
  var query = `SELECT * WHERE { ?g a :Group .
              OPTIONAL {?g :name ?name .}
              OPTIONAL {?g :number ?number .} }
              ORDER BY (?number)`

  var encoded = encodeURIComponent(prefixes + query)

  axios.get(baseLink + encoded)
    .then(dados => {
      var groups = []
      dados.data.results.bindings.map(bind => {
        var name = ""
        var number = ""

        if (bind.name)
          name = bind.name.value
        if (bind.number)
          number = bind.number.value

        groups.push([bind.g.value.split('#')[1], name, number])}
      )
      res.render('groups', {groups:groups})
    })
    .catch(erro => console.log(erro))
})


router.get('/groups/:g', function(req, res) {
  var query = `SELECT * WHERE { 
              OPTIONAL{:${req.params.g} :name ?name .}
              OPTIONAL{:${req.params.g} :number ?number .}
              :${req.params.g} :element ?e .}
              ORDER BY (?e)`
              
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(baseLink + encoded)
    .then(dados => {
      res.render('group', {id:req.params.g, group:dados.data.results.bindings})
    })
    .catch(erro => console.log(erro))
})


router.get('/periods', function(req, res) {
  var query = `SELECT * WHERE { ?p a :Period .
              OPTIONAL{ ?p :number ?number .} }
              ORDER BY (?number)`

  var encoded = encodeURIComponent(prefixes + query)

  axios.get(baseLink + encoded)
    .then(dados => {
      var periods = []
      dados.data.results.bindings.map(bind =>{
        var number = ""
        
        if (bind.number)
          number = bind.number.value
        
        periods.push([bind.p.value.split('#')[1], number ])}
      )
      res.render('periods', {periods:periods})
    })
    .catch(erro => console.log(erro))
})


router.get('/periods/:p', function(req, res) {
  var query = `SELECT * WHERE { 
              OPTIONAL{:${req.params.p} :number ?number .}
              :${req.params.p} :element ?e .}
              ORDER BY ASC (?e)`
  
  var encoded = encodeURIComponent(prefixes + query)

  axios.get(baseLink + encoded)
    .then(dados => {
      res.render('period', {id:req.params.p, period:dados.data.results.bindings})
    })
    .catch(erro => console.log(erro))
})



module.exports = router;
