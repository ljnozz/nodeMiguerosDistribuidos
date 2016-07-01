'use strict';
var express = require('express');
var funciones = require('../controllers/funcionesServidorPrincipal.js');
var almacenes = require('../controllers/inicializarAlmacenes.js');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/almacenes', function(req, res, next) {
  //res.render(" "+almacenes.almacenes);
  //console.log(almacenes);
  var itinerario = funciones.buscarItinerario("yuca");
  console.log(JSON.stringify(itinerario));
});


router.get('/pedido',function(req,res,next){

	var pedido = {
			"Pedido":[

				{"tipo":"LagartoSinHueso", "cantidad":5},
				{"tipo":"yuca", "cantidad":1}
			]
		};

	funciones.recibirPedido(pedido);
});

router.get('/posts', function(req, res, next) {
	console.log("cantDeLagartoSinHueso = " + req.query.cantDeLagartoSinHueso);
	console.log("cantYuca = " + req.query.cantYuca);
	console.log("cantCambur = " + req.query.cantCambur);

		var pedido = {
			"Pedido":[
				{"tipo":"Cambur", "cantidad":req.query.cantCambur},
				{"tipo":"LagartoSinHueso", "cantidad":req.query.cantDeLagartoSinHueso},
				{"tipo":"yuca", "cantidad":req.query.cantYuca}
			]
		};

	funciones.recibirPedido(pedido);

	setTimeout(function(){res.status(200).json(pedido)}, 1000);
	

});

module.exports = router;
