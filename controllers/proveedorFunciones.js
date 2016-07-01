var fs = require('fs');
var Hormiga = require('./hormiga.js');

var generarPesoMaximo = (hormigasActivas) =>  Math.floor(Math.random() * (hormigasActivas - 1 + 1) + 1); //Funcion para generar peso maximo
var hormigasActivas = 1;

const servidor = {
		"puerto":"3000",
		"ip":"127.0.0.1"
}

function actualizarNumeroDeHormigasActivas(numero){
	var hormigasActivas = numero;
	fs.writeFileSync('./controllers/almacenes.json', hormigasActivas,'utf8');
}


function leerNumeroDeHormigasActivas(){
	var hormigasActivas = fs.readFileSync('./controllers/hormgigasActivas.json','utf8');
	hormgigasActivas = JSON.parse(inventario);
	return hormigasActivas.hormigasActivas;
	
}

function leerGeneradores(){
	var generadores = fs.readFileSync('./controllers/generadores.json','utf8');
	generadores = JSON.parse(generadores);
	return generadores;
}

function leerInventario(){
	var almacenes = fs.readFileSync('./controllers/almacenes.json','utf8');
	almacenes = JSON.parse(almacenes);
	return almacenes;
}

function obtenerAlmacen(idAlmacen){
	var inventario = fs.readFileSync('./controllers/almacenes.json','utf8');
	var auxAlmacen = 0;
	inventario = JSON.parse(inventario);
	inventario.almacenes.forEach(function(almacen){
		if(almacen.idAlmacen == idAlmacen){
			auxAlmacen = almacen;
		}
	});
	return auxAlmacen;
}

function generarItinerario(orden){
	
	var itinerario = [];
	var generadores = leerGeneradores();
	generadores.generadores.forEach(function(generador){
		if(generador.tipoComida == orden.tipoComida){
			itinerario.push(generador);
		}
	});
	var almacen = obtenerAlmacen(orden.idAlmacen);
	itinerario.push(almacen);
	itinerario.push(servidor);
	return itinerario;
}


function generarHormiga(especificaciones){
	var hormiga = new Hormiga(especificaciones);
	hormiga.viajarRPC(hormiga);
}
function recibirOrden(orden){
			var idPedido = 0;
			var tipoComida = orden.tipoComida;
			var cantidad = orden.cantidad;
			var encomienda = orden.cantidad;
			var encomiendaHormiga = 0;
			var pesoMaximo = 0 ;
			var itinerario = 0;
			while(encomienda!=0){
				pesoMaximo = generarPesoMaximo(hormigasActivas);
				if(encomienda<=pesoMaximo){
					encomiendaHormiga = encomienda;
					encomienda=0;
				}else{
					encomiendaHormiga = pesoMaximo;
					encomienda = encomienda - pesoMaximo;
				}
				var itinerario = generarItinerario(orden);
				var especificaciones = {"tipoComida":tipoComida,"pesoMax":pesoMaximo,"carga":0,"itinerario":itinerario,"inventario":0,"idPedido":idPedido,"idHormiga":0,"encomienda":encomiendaHormiga,"ubicacionActual":0,"proximoDestino":0};
				console.log('Hormiga proveedora: '+pesoMaximo+ ' tipoComida'+ tipoComida);
				hormigasActivas++;
				generarHormiga(especificaciones);
				hormigasActivas++;
			}	
	
}

function actualizarAlmacenes(result){
	var actualizados = [];
	var viejos = leerInventario();
	var auxMayor = 0;
	var auxTimestamp = 0;
	viejos.almacenes.forEach(function(almacen){
		auxTimestamp = almacen.ultimaActualizacion;
		auxMayor = almacen;
				if(almacen.idAlmacen == result.itinerario[1].idAlmacen){
					console.log('Entro en el IF proveedor');
					if(auxTimestamp<result.itinerario[1].ultimaActualizacion){
						console.log('Entro en el IF MAUOR proveedor ');
						auxTimestamp = result.itinerario[1].ultimaActualizacion;
						auxMayor = result.itinerario[1];
					}
				}
		actualizados.push(auxMayor);
	});
	var almacenes =  '{"almacenes":'+ JSON.stringify(actualizados)+'}';
	fs.writeFileSync('./controllers/almacenes.json', almacenes,'utf8');
}
module.exports.recibirOrden = recibirOrden;
module.exports.actualizarAlmacenes = actualizarAlmacenes;