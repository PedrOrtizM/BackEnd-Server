var mongoose = require('mongoose');
//var uniqueValidator = require('mongoose-unique-validator') // Plugin que necesita ser instalado via npm
var Schema = mongoose.Schema;
var rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({

    nombre:  { type: String, required: [true, 'El nombre es necesario'] },
    email:   { type: String, required: [true, 'El correo es necesario'], unique: true},
    password:{ type: String, required: [true, 'La contraseña es necesaria'] },
    img:     { type: String, required: false },
    role:    { type: String, required: true, default: 'USER_ROLE',enum: rolesValidos}

});

//usuarioSchema.plugin(uniqueValidator,{message: '{path} debe de ser único'})

module.exports = mongoose.model('Usuarios',usuarioSchema);


