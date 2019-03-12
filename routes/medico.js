
  var express = require('express');
  var app = express();
  var Medico = require('../models/medico');
  var mdAutenticacion = require('../middlewares/autenticacion');


// ====================================================
//              Obtener todos los medicos
// ====================================================


app.get('/', (req, res, next) => {


    Medico.find({}).exec((err, medicos) => {

    if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error cargando medicos',
          errors: err
        });
    }
 
    res.status(200).json({
      ok: true,
      medicos: medicos
    });

  });

});






// ====================================================
//              Actualizar medico
// ====================================================

// Path: medico/id
app.put('/:id', mdAutenticacion.verificaToken,  (req,res)=>{

  var id = req.params.id;
  var body = req.body;

  Medico.findById(id,(err,medico)=>{

    
    // Si hay error
    if(err){
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar medico",
        errors: err
     });        
    }

    // si viene null
    if(!medico){

      return res.status(400).json({
        ok: false,
        mensaje: "El medico con el id "+id+"no existe",
        errors: {message: "No existe un medico con ese id"}
     })}
     
     
     medico.nombre = body.nombre;
     medico.hospital = body.hospital;
     medico.usuario = body.usuario;
     
     medico.save( ( err,medicoGuardado ) =>{
    
      if(err){
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar medico",
          errors: err
       });        
      }

      res.status(200).json({
        ok: true,
        medico: medicoGuardado
     });
    });

  });
});


// ====================================================
//              Crear un nuevo medico
// ====================================================

// se le pasa el middleware para que verifique el token 
app.post('/',mdAutenticacion.verificaToken,( req ,res)=>{

    var body = req.body;  // Funciona si usamos el bodyParse
    
    var medico = new Medico({
      nombre: body.nombre,
      usuario: req.usuario._id,
      hospital: body.hospital,
    });

    medico.save( ( err,medicoGuardado ) =>{
    
      if(err){
        return res.status(400).json({
          ok: false,
          mensaje: "Error al crear medico",
          errors: err
       });        
      }

      res.status(201).json({
        ok: true,
        medico: medicoGuardado,
        usuarioToken: req.usuario // usuario que realizó la petición , viene desde el middleware
                                  // pasado por parámetro
     });
 

    })

})



// ====================================================
//              Borrar medico por id
// ====================================================


app.delete('/:id', mdAutenticacion.verificaToken, (req,res)=>{

    var id = req.params.id;

    Medico.findByIdAndRemove(id,(err,medicoBorrado)=>{


      if(err){
        return res.status(500).json({
          ok: false,
          mensaje: "Error al eliminar medico",
          errors: err
       });        
      }

      res.status(200).json({
        ok: true,
        medico: medicoBorrado
     });

    })

})

  module.exports = app;