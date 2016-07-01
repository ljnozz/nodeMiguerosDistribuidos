'use strict';
var Hormiga = require('./hormiga.js');
var Almacen = require('./almacen.js');

//var almacenes = require('./inicializarAlmacenes.js');
//var almacenes = require('./almacenes.json');
var fs = require('fs');
var generarPesoMaximo = (hormigasActivas) =>  Math.floor(Math.random() * (hormigasActivas - 1 + 1) + 1); //Funcion para generar peso maximo
var hormigasActivas = 1;
var idPedido = 0;


// Recibe las especificaciones de la horamiga (tipocomida, peso maximo, carga , itinerario, inventario, idPedido, idHormiag, encomienda)
// Crea la hormiga con dicha especificacion y la manda a volar.
function generarHormiga(especificaciones){
	var hormiga = new Hormiga(especificaciones);
	console.log('Hormiga > Tipo comida ' + hormiga.obtenerTipoComida + ' Encomienda >'+hormiga.obtenerEncomienda + 'Peso maximo > '+hormiga.obtenerEncomienda+'itinerario:'+hormiga.obtenerItinerario);
	hormigasActivas++;
	console.log('Itinerario length'+hormiga.itinerario.length);
	
	hormiga.viajar(hormiga)
	.then(function(result){
		console.log("Hormiga regreso "+result.tipoComida+' carga: '+result.carga);
		console.log('Itinerario length '+hormiga.itinerario.length);
	});

	
}

function generarHormigas(especificaciones){
	var promises = [];
	especificaciones.forEach(function(especificacion){
		var hormiga = new Hormiga(especificacion);
		console.log('Hormiga > Tipo comida' + hormiga.obtenerTipoComida + 'Encomienda >'+hormiga.obtenerEncomienda + 'Peso maximo > '+hormiga.obtenerEncomienda+'itinerario:v'+hormiga.obtenerItinerario);
		hormigasActivas++;
		console.log('Itinerario length'+hormiga.itinerario.length);
		promises.push(hormiga.viajar(hormiga));
	});
}

// Devuelve la cantidad de un determinado tipo de comida que posee un almacen
function devolverCantidadComida(obj,tipoComida){
	obj.inventario.forEach(function(inventario){
			if(inventario.tipoComida == tipoComida){
				return inventario.cantidad;
			}
	});
}

function leerInventario(){
	var inventario = fs.readFileSync('./controllers/almacenes.json','utf8');
	inventario = JSON.parse(inventario);
	return inventario;
}

// Funcion que ayuda a bubblesort ( Se debe manejar la asincronia para usarla)
function swap(myArr, indexOne, indexTwo){
  var tmpVal = myArr[indexOne];
  myArr[indexOne] = myArr[indexTwo];
  myArr[indexTwo] = tmpVal;
  return myArr;
}



// Ordena de mayor a menor un arreglo de almacenes con respecto a la cantidad de un tipo de comida
function bubbleSortItinerario(myArr,tipoComida){
  var size = myArr.length;
  for( var pass = 1; pass < size; pass++ ){ // outer loop
    for( var left = 0; left < (size - pass); left++){ // inner loop
      var right = left + 1;

      var cantLeft = 0;
      var cantRight = 0;
      myArr[left].inventario.forEach(function(inventario){
			if(inventario.tipoComida == tipoComida){
			   cantLeft = inventario.cantidad;
			}
		}); 
      myArr[right].inventario.forEach(function(inventario){
			if(inventario.tipoComida == tipoComida){
				cantRight = inventario.cantidad;
			}
		}); 
      if(cantLeft < cantRight){
        var tmpVal = myArr[left];
		myArr[left] = myArr[right];
		myArr[right] = tmpVal;
      }
    }
  }
  return myArr;
}

// Busca el itinerario de la hormiga
// Recibe un tipo de comida y crea un arreglo con la lista de almacenes destinos en orden descendentes a sus cantidades disponibles
function buscarItinerario(tipocomida){
	var itinerario = [];
	var almacenes  = leerInventario();
	almacenes.almacenes.forEach(function(almacen){
	//almacenes.forEach(function(almacen){
		almacen.inventario.forEach(function(inventario){
			if(inventario.tipoComida == tipocomida)
				itinerario.push(almacen);
		});
	});
	return bubbleSortItinerario(itinerario,tipocomida);
}


function actualizarAlmacenes(result){
	var actualizados = [];
	var viejos = leerInventario();
	var auxMayor = 0;
	var auxTimestamp = 0;
	viejos.almacenes.forEach(function(almacen){
		auxTimestamp = almacen.ultimaActualizacion;
		auxMayor = almacen;
		result.forEach(function(resultado){
			resultado.itinerario.forEach(function(itinerario){
				if(itinerario.idAlmacen == almacen.idAlmacen){
					if(auxTimestamp<itinerario.ultimaActualizacion){
						auxTimestamp = itinerario.ultimaActualizacion;
						auxMayor = itinerario;
					}
				}
			});
		});
		actualizados.push(auxMayor);
	});
	var almacenes =  '{"almacenes":'+ JSON.stringify(actualizados)+'}';
	fs.writeFileSync('./controllers/almacenes.json', almacenes,'utf8');
}


// La funcion recibe un pedido de la hormiga reina, dicho pedido contiene los tipos de comida y cantidades que ella desea.
// El objetivo de la funcion es el de crear a las hormigas necesarias para satisfacer dicho pedido.
function recibirPedido(pedido){
	var arrayEspecificaciones = [];
	pedido.Pedido.forEach(function(item){
		console.log(item.tipo);
		console.log(item.cantidad);
		var tipoComida = item.tipo;
		var cantidad = item.cantidad;
		var encomienda = cantidad;
		var encomiendaHormiga = 0;
		var pesoMaximo = 0 ;
		var itinerario = 0;
		while(encomienda!=0){
			pesoMaximo = generarPesoMaximo(hormigasActivas);
			console.log('PesoMaximo ='+pesoMaximo);
			if(encomienda<=pesoMaximo){
				encomiendaHormiga = encomienda;
				encomienda=0;
			}else{
				encomiendaHormiga = pesoMaximo;
				encomienda = encomienda - pesoMaximo;
			}
			var itinerario = buscarItinerario(tipoComida);
			var especificaciones = {"tipoComida":tipoComida,"pesoMax":pesoMaximo,"carga":0,"itinerario":itinerario,"inventario":0,"idPedido":idPedido,"idHormiga":0,"encomienda":encomiendaHormiga,"ubicacionActual":0,"proximoDestino":0};
			arrayEspecificaciones.push(especificaciones);
			hormigasActivas++;
			//generarHormiga(especificaciones);
		}
	});
	Promise.all(arrayEspecificaciones.map(function(esp){
		var hormiga = new Hormiga(esp);
		console.log('Esp: '+esp);
		var promise = hormiga.viajar(hormiga);
		return promise;
	}))
	.then(function(result){

		result.forEach(function(resultado){
			console.log('Hormiga llego tipoComida: '+resultado.tipoComida+' Carga: '+resultado.carga +' Peso Max: '+resultado.pesoMax+'Encomienda: '+resultado.encomienda);
			hormigasActivas--;
		});
		actualizarAlmacenes(result);
	});
	idPedido++;

}


/* Funcion para ordenar itinerario usando QUICKSORT, falta manejar la asincronia
function quicksort(data,tipoComida) {
    if (data.length == 0) return [];
  
    var left = [], right = [], pivot = data[0];
  
    for (var i = 1; i < data.length; i++) {
        if(devolverCantidadComida(data[i],tipoComida) < devolverCantidadComida(pivot,tipoComida))
            left.push(data[i])
        else
            right.push(data[i]);
    }
  
    return quicksort(left,tipoComida).concat(pivot, quicksort(right,tipoComida));
}
*/

module.exports.generarHormiga = generarHormiga;
module.exports.recibirPedido = recibirPedido;
module.exports.buscarItinerario= buscarItinerario;