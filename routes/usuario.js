
  var express = require('express');
  var app = express();
  const bcrypt = require('bcrypt');
  var Usuario = require('../models/usuario');
  var mdAutenticacion = require('../middlewares/autenticacion');


// ====================================================
//              Obtener todos los usuarios
// ====================================================


app.get('/', (req, res, next) => {

  // Para escificar que campos quiero regresar
  Usuario.find({}, 'nombre email img role').exec((err, usuarios) => {

    if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error cargando usuarios',
          errors: err
        });
    }
 
    res.status(200).json({
      ok: true,
      usuarios: usuarios
    });

  });

});








// ====================================================
//              Actualizar usuario
// ====================================================

// Path: Usuario/id
app.put('/:id', mdAutenticacion.verificaToken,  (req,res)=>{

  var id = req.params.id;
  var body = req.body;

  Usuario.findById(id,(err,usuario)=>{

    
    // Si hay error
    if(err){
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar usuario",
        errors: err
     });        
    }

    // si viene null
    if(!usuario){

      return res.status(400).json({
        ok: false,
        mensaje: "El usuario con el id "+id+"no existe",
        errors: {message: "No existe un usuario con ese id"}
     })}
     
     
     usuario.nombre = body.nombre;
     usuario.email = body.email;
     usuario.role = body.role;

     usuario.save( ( err,usuarioGuardado ) =>{
    
      if(err){
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar usuario",
          errors: err
       });        
      }

      // Ya el usuario está registrado en la base de datos 
      // para que no muestre la contraseña en la respuesta le paso una ;D
      usuarioGuardado.password = ';D';

      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado
     });
    });

  });
});


// ====================================================
//              Crear un nuevo usuario
// ====================================================

// se le pasa el middleware para que verifique el token 
app.post('/',mdAutenticacion.verificaToken,( req ,res)=>{

    var body = req.body;  // Funciona si usamos el bodyParse
    
    var usuario = new Usuario({
      nombre: body.nombre,
      email: body.email,
      password: bcrypt.hashSync(body.password,10),  // libreria bcript para cifrar
      img: body.img,
      role: body.role
    });

    usuario.save( ( err,usuarioGuardado ) =>{
    
      if(err){
        return res.status(400).json({
          ok: false,
          mensaje: "Error al crear usuario",
          errors: err
       });        
      }

      res.status(201).json({
        ok: true,
        usuario: usuarioGuardado,
        usuarioToken: req.usuario // usuario que realizó la petición , viene desde el middleware
                                  // pasado por parámetro
     });
 

    })

})



// ====================================================
//              Borrar usuario por id
// ====================================================


app.delete('/:id', mdAutenticacion.verificaToken, (req,res)=>{

    var id = req.params.id;

    Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{


      if(err){
        return res.status(500).json({
          ok: false,
          mensaje: "Error al eliminar usuario",
          errors: err
       });        
      }

      res.status(200).json({
        ok: true,
        usuario: usuarioBorrado
     });

    })

})

  module.exports = app;