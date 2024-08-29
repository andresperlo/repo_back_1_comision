const { Schema, model } = require('mongoose')

const UsuarioSchema = new Schema({
  nombreUsuario:{
    type:String,
    required: true,
    trim: true,
    unique: true
  },
  contrasenia:{
    type:String,
    required: true,
    trim: true,
  },
  emailUsuario:{
    type:String,
    required:true
  },
  rol:{
    type:String,
    default: 'usuario',
    enum:['usuario', 'admin']
  },
  bloqueado:{
    type:Boolean,
    default: false
  },
  carrito:[],
  favoritos:[]
})

UsuarioSchema.methods.toJSON = function() {
   const { contrasenia, __v, ...usuario  }  = this.toObject()
   return usuario
}

const UsuarioModel = model('usuario', UsuarioSchema)
module.exports = UsuarioModel