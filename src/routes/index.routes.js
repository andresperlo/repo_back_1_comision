const { Router } = require('express')
const router = Router()

router.use('/productos', require('./productos.routes'))
router.use('/usuarios', require('./usuarios.routes'))
/* router.use('/categoria', require('./categoria.routes')) */

module.exports = router