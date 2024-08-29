const { Result } = require('express-validator')
const cloudinary = require('../helpers/cloudinary')
const ProductosModel = require('../models/productos.schema')
const UsuarioModel = require('../models/usuarios.schema')
const { MercadoPagoConfig, Preference } = require('mercadopago')

const nuevoProducto = async (body) => {
  try {
    const producto = new ProductosModel(body)
    await producto.save()

    return {
      msg: 'Producto creado',
      statusCode: 201
    }
  } catch (error) {
    console.log(error)
    return {
      msg: 'Error al crear el producto',
      statusCode: 500,
      error
    }
  }
}

const obtenerProductos = async () => {
  try {
    const productos = await ProductosModel.find()
  
    return {
      productos,
      statusCode: 200
    }
  } catch (error) {
    return {
      msg: 'Error al crear el producto',
      statusCode: 500,
      error
    }
  }
}

const obtenerProducto = async (idProducto) => {
  try {
    console.log(idProducto)
    const producto = await ProductosModel.findById(idProducto)
    console.log(producto)
    return {
      producto,
      statusCode: 200
    }
  } catch (error) {
    return {
      msg: 'Error al crear el producto',
      statusCode: 500,
      error
    }
  }
}

const actualizarProducto = async (idProducto, body) => {
  try {
    await ProductosModel.findByIdAndUpdate({ _id: idProducto }, body)

    return {
      msg: 'Producto actualizado',
      statusCode: 200
    }
  } catch (error) {
    return {
      msg: 'Error al crear el producto',
      statusCode: 500,
      error
    }
  }
}

const eliminarProducto = async (idProducto) => {
  const productoExiste = await ProductosModel.findById(idProducto)

  if (productoExiste) {
    await ProductosModel.findByIdAndDelete({ _id: idProducto })
    const productosDb = await ProductosModel.find()
    return {
      msg: 'Producto eliminado',
      productos: productosDb,
      statusCode: 200
    }
  } else {
    return {
      msg: 'ID incorrecto',
      statusCode: 400
    }
  }
}

const imagenProducto = async (idProducto, file) => {
  try {
    const producto = await ProductosModel.findById(idProducto)
    const imagen = await cloudinary.uploader.upload(file.path)
    producto.imagen = imagen.url
    await producto.save()

    return {
      msg: 'Imagen cargada',
      statusCode: 200
    }

  } catch (error) {
    return {
      msg: 'Error al crear el producto',
      statusCode: 500,
      error
    }
  }
}

const agregarProductoFav = async (idProducto, idUsuario) => {
  console.log(idUsuario)
  try {
    const producto = await ProductosModel.findById(idProducto)
    const usuario = await UsuarioModel.findById(idUsuario)
    console.log(producto)
    console.log(usuario)
    const productoExiste = usuario.favoritos.find((prod) => prod.id === idProducto)

    if (productoExiste) {
      return {
        mag: 'Producto ya existe en Favoritos',
        statusCode: 400
      }
    }

    usuario.favoritos.push(producto)
    await usuario.save()

    return {
      msg: 'Producto agregado a Favoritos',
      statusCode: 200
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      msg: 'Error al agregar el producto a favoritos'
    }
  }
}

const agregarProductoCarrito = async (idProducto, idUsuario) => {
  try {
    const producto = await ProductosModel.findById(idProducto)
    const usuario = await UsuarioModel.findById(idUsuario)

    const productoExiste = usuario.carrito.find((prod) => prod.id === idProducto)

    if (productoExiste) {
      return {
        mag: 'Producto ya existe en el Carrito',
        statusCode: 400
      }
    }

    usuario.carrito.push(producto)
    await usuario.save()

    return {
      msg: 'Producto agregado al carrito',
      statusCode: 200
    }
  } catch (error) {
    return {
      statusCode: 500,
      msg: 'Error al agregar el producto al carrito'
    }
  }
}

const borrarProductoFav = async (idProducto, idUsuario) => {
  try {
    const usuario = await UsuarioModel.findById(idUsuario)

    const posicionProducto = usuario.favoritos.findIndex((prod) => prod.id === idProducto)

    usuario.favoritos.splice(posicionProducto, 1)
    await usuario.save()

    return {
      msg: 'Producto borrdado de Favoritos',
      statusCode: 200
    }
  } catch (error) {
    return {
      statusCode: 500,
      msg: 'Error al borrar el producto de favoritos'
    }
  }
}


const borrarProductoCarrito = async (idProducto, idUsuario) => {
  try {
    const usuario = await UsuarioModel.findById(idUsuario)

    const posicionProducto = usuario.carrito.findIndex((prod) => prod.id === idProducto)

    usuario.carrito.splice(posicionProducto, 1)
    await usuario.save()

    return {
      msg: 'Producto borrdado del Carrito',
      statusCode: 200
    }
  } catch (error) {
    return {
      statusCode: 500,
      msg: 'Error al borrar el producto del carrito'
    }
  }
}

const habilitarProducto = async (idProducto) =>{ 
  const producto = await ProductosModel.findById(idProducto)
  producto.bloqueado = false
  await producto.save()

  return {
    msg: 'Producto habilitado',
    statusCode: 200

  }
}

const deshabilitarProducto = async (idProducto) =>{ 
  const producto = await ProductosModel.findById(idProducto)
  producto.bloqueado = true
  await producto.save()

  return {
    msg: 'Producto deshabilitado',
    statusCode: 200
    
  }
}

const obtenerProductosFavoritos = async(idUsuario) =>{
  const usuario = await UsuarioModel.findById(idUsuario)
  console.log(usuario)
  return{
    productos: usuario.favoritos,
    statusCode: 200
  }

}

const obtenerProductosCarrito = async(idUsuario) =>{
  const usuario = await UsuarioModel.findById(idUsuario)
  
  return{
    productos: usuario.carrito,
    statusCode: 200
  }

}

const pagoConMP = async (body) => {
  const client = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN})
  const preference = new Preference(client)
  const result = await preference.create({
    body: {
      items:[
        {
          title:'cel 1',
          quantity: 1,
          unit_price: 150000,
          currency_id:'ARS'
        },
        {
          title:'cel 2',
          quantity: 1,
          unit_price: 150000,
          currency_id:'ARS'
        },
      ],
      back_urls: {
        success:'http://localhost:5173/user-cart',
        failure:'http://localhost:5173/user-cart',
        pending:'http://localhost:5173/user-cart'
      },
      auto_return: 'approved'
    }
  })

  return {
    urlPay: result.id,
    statusCode: 200
  }
  
}



module.exports = {
  nuevoProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto,
  imagenProducto,
  agregarProductoFav,
  agregarProductoCarrito,
  borrarProductoFav,
  borrarProductoCarrito,
  habilitarProducto,
  deshabilitarProducto,
  obtenerProductosFavoritos,
  obtenerProductosCarrito,
  pagoConMP
}


