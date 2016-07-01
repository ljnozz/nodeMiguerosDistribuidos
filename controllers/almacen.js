'use strict';
var Eureca = require('eureca.io');

module.exports = class Almacen{

		// Las especificaciones vienen en formato JSON
		constructor(especificaciones) {
	    this.puerto = especificaciones.puerto;
	    this.ip = especificaciones.ip;
	    this.inventario = especificaciones.inventario;
	    this.idAlmacen = especificaciones.idAlmacen;
	  }

set actualizarInventario(inventario){
	this.inventario = inventario;
}

get obtenerInformacion(){
		var informacion  = {
			ip:this.ip,
			puerto: this.puerto,
		}
		return informacion;
	}
get obtenerId(){
		return this.idAlmacen;
	}

	verificarProducto(tipoComida){
		this.inventario.forEach(function(inventario){
			if(inventario.compararComida(tipoComida))
				return true;
		});
	}


	


} ;
