const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req,res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en Uptask'
    })
}

exports.formIniciarSesion = (req,res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesion en Uptask',
        error
    })
}

exports.crearCuenta = async (req, res) => {
    //leer los datos
    const { email, password } = req.body;

    try {
        //crear usuario
        await Usuarios.create({
            email,
            password
        });

        //crear url confirmar
        const confirmarUrl =`http://${req.headers.host}/confirmar/${email}`;

        //crear objeto de usuario
        const usuario = {
            email
        }

        //enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta',
            confirmarUrl,
            archivo: 'confirmarCuenta'
        });

        //redirigir
        req.flash('correcto', 'Te enviamos un correo para verificar tu cuenta')
        res.redirect('/iniciar-sesion');

    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));

        res.render('crearCuenta',{
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en Uptask',
            email,
            password
        })
    }
}

exports.formRestablecerPassword = (req,res) => {
    res.render('restablecer', {
        nombrePagina: 'Restablecer tu Contraseña'
    })
}

exports.confirmaCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where:{
            email: req.params.correo
        }
    });

    //si no existe el usuario

    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta')
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correrto', 'Cuenta activada correctamente');
    res.redirect('/inciar-sesion');
}