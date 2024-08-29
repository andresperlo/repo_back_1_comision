const transporter = require('../helpers/nodemailer')

const registroUsuario = async(emailUsuario) => {
 await transporter.sendMail({
    from: `"nombreDeLaEmpresa 👻" <${process.env.GMAIL_USER}>`, // sender address
    to: emailUsuario, // list of receivers
    subject: "Registro exitoso ✔", // Subject line
    html: "<b>TE DAMOS LA BIENVENIDA A NUESTRA PAGINA</b>", // html body
  });
}

module.exports = {
  registroUsuario
}