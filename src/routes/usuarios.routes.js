const express = require('express')
const { crearUsuario, traerTodosLosUsuarios, traerUnUsuario, actualizarUnUsuario, eliminarUnUsuario, inicioSesion, habilitarUnUsuario, deshabilitarUnUsuario } = require('../controllers/usuarios.controllers')
const auth = require('../middlewares/auth')
const { check } = require('express-validator')

const router = express.Router()

router.post('/', [
  check('nombreUsuario', 'Campo NOMBREUSUARIO vacio').not().isEmpty(),
  check('nombreUsuario', 'Minimo de 5 caracteres').isLength({min:5}),
  check('contrasenia', 'Campo CONTRASEÑA vacio').not().isEmpty(),
  check('contrasenia', 'Min: 8 y Max: 40').isLength({min:8, max:40}),
], crearUsuario)
router.post('/login', [
  check('nombreUsuario', 'Campo NOMBREUSUARIO vacio').not().isEmpty(),
  check('nombreUsuario', 'Minimo de 5 caracteres').isLength({min:5}),
  check('contrasenia', 'Campo CONTRASEÑA vacio').not().isEmpty(),
  check('contrasenia', 'Min: 8 y Max: 40').isLength({min:8, max:40}),
],inicioSesion)
router.get('/', auth('admin'),traerTodosLosUsuarios)
router.get('/:idUsuario', auth('admin'), traerUnUsuario)
router.put('/:idUsuario', auth('admin'), actualizarUnUsuario)
router.put('/habilitar/:idUsuario', auth('admin'), habilitarUnUsuario)
router.put('/deshabilitar/:idUsuario', auth('admin'), deshabilitarUnUsuario)
router.delete('/:idUsuario', auth('admin'), eliminarUnUsuario)

module.exports = router
