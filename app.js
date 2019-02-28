const express = require('express');
const mongoose = require('mongoose');

//Varibles
const app = express();


// Conexion a la BD
mongoose.connection.openUri('mongodb://localhost:27017/HospitalDB',{ useNewUrlParser: true },(err, resp)=>{

  if(err) throw err;

  console.log("Base de datos OK!");
  


})



// Se establece el Puerto
app.listen(3000, ()=>{
    console.log("Escuchando el puerto: 3000","online");
  });


  app.get('/', (req,res,next)=>{


    console.log(" ");
    res.status(200).json({
       ok: true,
       mensaje: "Petición realizada correctamente"
    })
    

  })