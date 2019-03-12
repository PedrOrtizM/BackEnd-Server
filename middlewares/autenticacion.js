// ====================================================
//              Verificar Token
// ====================================================


var jwt = require('jsonwebtoken');
var SEMILLA = require('../config/config').SEMILLA;



exports.verificaToken = function (req,res,next) {

    var token = req.query.token;

  jwt.verify(token,SEMILLA, (err,decoded)=>{

    if(err){

        return res.status(401).json({
            ok:false,
            mensaje: 'Token Incorrecto',
            errors: err
        });
    }
    //el reques va ser el mismo usuario que viene en el token decodificado
    req.usuario = decoded.usuario;

    // para que continue con la ejecución de donde se está pasando por parametro la 
    next();
    })

}
