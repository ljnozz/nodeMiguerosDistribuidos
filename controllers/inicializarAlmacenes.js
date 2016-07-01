var Almacen = require('./almacen.js');
var almacenes = [];

var almacen1 = {
						puerto:"8000",
						ip:"127.0.0.1",
						inventario:[
							{tipoComida:"yuca",cantidad:50},
							{tipoComida:"Cambur",cantidad:50},
							{tipoComida:"LagartoSinHueso",cantidad:10},
						],
						idAlmacen:1,
						ultimaActualizacion:0
					};
var almacen2 = {
						puerto:"8001",
						ip:"127.0.0.1",
						inventario:[
							{tipoComida:"mango",cantidad:50},
							{tipoComida:"LagartoSinHueso",cantidad:20},
							{tipoComida:"cuca",cantidad:10}
						],
						idAlmacen:2,
						ultimaActualizacion:0
					};
var almacen3 = {
						puerto:"8002",
						ip:"127.0.0.1",
						inventario:[
							{tipoComida:"yuca",cantidad:100},
							{tipoComida:"Cambur",cantidad:20},
							{tipoComida:"cuca",cantidad:10}
						],
						idAlmacen:3,
						ultimaActualizacion:0
};
var almacen4 = {
						puerto:"8003",
						ip:"127.0.0.1",
						inventario:[
							{tipoComida:"yuca",cantidad:30},
							{tipoComida:"pepino",cantidad:20},
							{tipoComida:"LagartoSinHueso",cantidad:10}
						],
						idAlmacen:3,
						ultimaActualizacion:0
};

var servidorPrincipal = {
	puerto: "3000",
	ip:"127.0.0.1"
};

almacenes.push(almacen1);
almacenes.push(almacen2);
almacenes.push(almacen3);
almacenes.push(almacen4);
module.exports.almacenes = almacenes;
module.exports.servidorPrincipal = servidorPrincipal;

