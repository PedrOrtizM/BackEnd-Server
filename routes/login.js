
var mongoose = require('mongoose');
var express = require('express');
var app = express();
var jwt = require('jsonwebtoken');
var Usuario = require('../models/usuario');
var SEMILLA = require('../config/config').SEMILLA;
const bcrypt = require('bcrypt');



app.post('/',(req,res)=>{

    var body = req.body;


    Usuario.findOne( { email: body.email} , ( err , usuarioDB)=>{


        // Si hay error
        if(err){
            return res.status(500).json({
            ok: false,
            mensaje: "Error al buscar usuario",
            errors: err
        });        
        }

        // si no trae nada es porque el email es incorrecto
        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrectar -email",
                errors: err
            });      
        }

        // Si no coinciden las contraseñas 
        if( ! bcrypt.compareSync(  body.password , usuarioDB.password  ) ){

            return res.status(400).json({
                ok: false,
                mensaje: "Credenciales incorrectar -password",
                errors: err
            });      

        }


        usuarioDB.password = ':D';
        var token = jwt.sign({usuario: usuarioDB},SEMILLA,{ expiresIn: 14400 }); //14400 son 4h


        res.status(200).json({
            ok: true,
           usuario: usuarioDB,
           token: token,
           id: usuarioDB.id
          });
    



    })


});

module.exports = app;