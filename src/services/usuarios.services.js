const UsuarioModel = require('../models/usuarios.schema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { registroUsuario } = require('../helpers/messages')

const nuevoUsuario = async(body) => {
 try {

  const usuarioExiste = await UsuarioModel.findOne({nombreUsuario: body.nombreUsuario})

  if(usuarioExiste){
    return {
      msg:'usuario no disponible',
      statusCode: 409
    }
  }

  const usuario = new UsuarioModel(body)

  let salt = bcrypt.genSaltSync();
  usuario.contrasenia = bcrypt.hashSync(body.contrasenia, salt);

  registroUsuario(body.emailUsuario)
  await usuario.save()
  return {
    msg:'Usuario creado',
    statusCode: 201
  }
 } catch (error) {
  console.log(error)
   return {
    msg:'Error al crear el usuario',
    statusCode: 500,
    error
   }
 }
}

const obtenerUsuarios = async() => {
  try {
    const usuarios = await UsuarioModel.find()
    return{
      usuarios,
      statusCode: 200
    }
  } catch (error) {
    return {
      msg:'Error al obtener los usuarios',
      statusCode: 500,
      error
     }
  }
}

const obtenerUsuario = async(idUsuario) => {
  try {
    const usuario = await UsuarioModel.findById(idUsuario)
    return{
      usuario,
      statusCode: 200
    }
  } catch (error) {
    return {
      msg:'Error al obtener el usuario',
      statusCode: 500,
      error
     }
  }
}

const actualizarUsuario = async(idUsuario, body) => {
  try {
    await UsuarioModel.findByIdAndUpdate({_id: idUsuario}, body)
  
  return{
    msg:'Usuario actualizado',
    statusCode: 200
  }
  } catch (error) {
    return {
      msg:'Error al actualizar el usuario',
      statusCode: 500,
      error
     }
  }
}

const eliminarUsuario = async(idUsuario) => {
  await UsuarioModel.findByIdAndDelete({_id:idUsuario})
  const usuarioDb = await UsuarioModel.find()
  return{
    msg:'Usuario eliminado',
    usuarios: usuarioDb,
    statusCode: 200
  }
}

const inicioSesionUsuario = async (body) => {
  const usuarioExiste = await UsuarioModel.findOne({nombreUsuario: body.nombreUsuario})
  if(!usuarioExiste){
    return{
      msg:'Usuario y/o contraseña incorrecto.USUARIO',
      statusCode: 400
    }
  }

  const checkContrasenia = bcrypt.compareSync(body.contrasenia, usuarioExiste.contrasenia)

  if(!checkContrasenia){
    return{
      msg:'Usuario y/o contraseña incorrecto.CONTRASEÑA',
      statusCode: 400
    }
  }

  const payload = {
    idUsuario: usuarioExiste._id,
    rol: usuarioExiste.rol,
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET)

  return{
    token,
    rol: usuarioExiste.rol,
    idUsuario:usuarioExiste._id,
    msg:'Usuario logueado',
    statusCode: 200
  }

}

const habilitarUsuario = async(idUsuario) => {
  const usuario = await UsuarioModel.findById(idUsuario)
  usuario.bloqueado = false
  await usuario.save()

  return {
    msg:'Usuario habilitado',
    statusCode: 200
    }
}

const deshabilitarUsuario = async(idUsuario) => {
  const usuario = await UsuarioModel.findById(idUsuario)
  usuario.bloqueado = true
  await usuario.save()

  return {
    msg:'Usuario deshabilitado',
    statusCode: 200
    }
}




module.exports = {
  nuevoUsuario,
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  inicioSesionUsuario,
  habilitarUsuario,
  deshabilitarUsuario
}
