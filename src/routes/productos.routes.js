const express = require('express')
const { crearProducto, traerTodosLosProductos, traerUnProducto, actualizarUnProducto, eliminarUnProducto, agregarImagenProducto, agregarProductoAfavoritos, agregarProductoAlCarrito, borrarProductoDeFav, borrarProductoDelCarrito, habilitarUnProducto, deshabilitarUnProducto, obtenerProductoFavUsuario, obtenerProductoCarritoUsuario, mercadopago } = require('../controllers/productos.controllers')
const { check } = require('express-validator')
const multer = require('../middlewares/multer')
const auth = require('../middlewares/auth')
const router = express.Router()

router.get('/obtenerProdFav',auth('usuario'), obtenerProductoFavUsuario)
router.get('/obtenerProdCart', auth('usuario'),obtenerProductoCarritoUsuario)
router.get('/:idProducto', traerUnProducto)
router.get('/', traerTodosLosProductos)

router.post('/', [
  check('nombre', 'Campo NOMBRE vacio').not().isEmpty(),
  check('precio', 'Campo PRECIO vacio').not().isEmpty(),
  check('descripcion', 'Campo DESCRIPCION vacio').not().isEmpty(),
], auth('admin'),  crearProducto)
router.put('/:idProducto', [
  check('nombre', 'Campo NOMBRE vacio').not().isEmpty(),
  check('precio', 'Campo PRECIO vacio').not().isEmpty(),
  check('descripcion', 'Campo DESCRIPCION vacio').not().isEmpty(),
], auth('admin'),actualizarUnProducto)

router.put('/habilitar/:idProducto', auth('admin'), habilitarUnProducto)
router.put('/deshabilitar/:idProducto', auth('admin'), deshabilitarUnProducto)
router.post('/payMp', auth('usuario'), mercadopago)
router.post('/agregarImagen/:idProducto', multer.single('imagen'), auth('usuario'), agregarImagenProducto)
router.post('/agregarProdFav/:idProducto', auth('usuario'), agregarProductoAfavoritos)
router.post('/agregarProdCart/:idProducto', auth('usuario'), agregarProductoAlCarrito)
router.delete('/borrarProdFav/:idProducto', auth('usuario'), borrarProductoDeFav)
router.delete('/borrarProdCart/:idProducto', auth('usuario'), borrarProductoDelCarrito)

router.delete('/:idProducto', auth('admin'),eliminarUnProducto)

module.exports = router
