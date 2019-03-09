var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')


//Varibles
var app = express();


// Body Parse | parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');



// Conexion a la BD
mongoose.connection.openUri('mongodb://localhost:27017/DBHospital',(err, resp)=>{
  
  if(err) throw err;

    console.log("Base de datos OK!");
  
})


app.use('/usuario',usuarioRoutes);
app.use('/',appRoutes);




// Se establece el Puerto, escucha peticiones
app.listen(3000, ()=>{
    console.log("Escuchando el puerto: 3000","online");
  });

