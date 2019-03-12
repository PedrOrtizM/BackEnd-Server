
  var express = require('express');
  var app = express();
  var Hospital = require('../models/hospital');
  var mdAutenticacion = require('../middlewares/autenticacion');


// ====================================================
//              Obtener todos los hospitales
// ====================================================


app.get('/', (req, res, next) => {


    Hospital.find({}).exec((err, hospitales) => {

    if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error cargando hospitales',
          errors: err
        });
    }
 
    res.status(200).json({
      ok: true,
      hospitales: hospitales
    });

  });

});






// ====================================================
//              Actualizar hospital
// ====================================================

// Path: hospital/id
app.put('/:id', mdAutenticacion.verificaToken,  (req,res)=>{

  var id = req.params.id;
  var body = req.body;

  Hospital.findById(id,(err,hospital)=>{

    
    // Si hay error
    if(err){
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar hospital",
        errors: err
     });        
    }

    // si viene null
    if(!hospital){

      return res.status(400).json({
        ok: false,
        mensaje: "El hospital con el id "+id+"no existe",
        errors: {message: "No existe un hospital con ese id"}
     })}
     
     
     hospital.nombre = body.nombre;
     hospital.usuario = req.usuario._id;
     
     hospital.save( ( err,hospitalGuardado ) =>{
    
      if(err){
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar hospital",
          errors: err
       });        
      }

      res.status(200).json({
        ok: true,
        hospital: hospitalGuardado
     });
    });

  });
});


// ====================================================
//              Crear un nuevo hospital
// ====================================================

// se le pasa el middleware para que verifique el token 
app.post('/',mdAutenticacion.verificaToken,( req ,res)=>{

    var body = req.body;  // Funciona si usamos el bodyParse
    
    var hospital = new Hospital({
      nombre: body.nombre,
      usuario: req.usuario._id
    });

    hospital.save( ( err,hospitalGuardado ) =>{
    
      if(err){
        return res.status(400).json({
          ok: false,
          mensaje: "Error al crear hospital",
          errors: err
       });        
      }

      res.status(201).json({
        ok: true,
        hospital: hospitalGuardado    
     });
 

    })

})



// ====================================================
//              Borrar hospital por id
// ====================================================


app.delete('/:id', mdAutenticacion.verificaToken, (req,res)=>{

    var id = req.params.id;

    Hospital.findByIdAndRemove(id,(err,hospitalBorrado)=>{


      if(err){
        return res.status(500).json({
          ok: false,
          mensaje: "Error al eliminar hospital",
          errors: err
       });        
      }

      res.status(200).json({
        ok: true,
        hospital: hospitalBorrado
     });

    })

})

  module.exports = app;