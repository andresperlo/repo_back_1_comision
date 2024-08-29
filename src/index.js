require('dotenv').config()
require('./DB/config')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
//app.use(express.urlencoded({extended:true}))
//Rutas http//localhost/api/productos/id
app.use('/api', require('./routes/index.routes'))


app.listen(3001, () => {
  console.log('servidor andando en el puerto ', 3001)
})