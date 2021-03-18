const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const { Op } = require("sequelize");
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

//autenticar usuario
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

//funcion para revisar si el usuario esta logeado
exports.usuarioAutenticado = (req, res, next) => {
    //si el usuario esta autenticado, adelante
    if(req.isAuthenticated()){
        return next();
    }
    //si no esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

//cerrar sesion
exports.cerrarSesion = ( req,res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    })
}

//genera un token si el usuario es valido
exports.enviarToken = async (req,res) => {
    //verifircar si existe usuaior
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where:{email}});

    //si no exist el usuario
    if(!usuario){
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/restablecer');
    }

    //usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    //guardar en la BD
    await usuario.save();

    //url de reset
    const resetUrl =`http://${req.headers.host}/restablecer/${usuario.token}`;

    //evnia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'restablecerPassword'
    });

    //terminar ejecucion
    req.flash('correcto', 'Se envio un mensaje a tu correo');
    res.redirect('/iniciar-session');
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    //si no hay usuario
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/restablecer'); 
    }

    //formulario para generar password
    res.render('resetPassword', {
        nombrePagina: 'Restablecer Contraseña'
    })
}

exports.actualiazrPassword = async (req,res) => {
    //verifica token valido y fecha de expiracion

    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });
    //verificar si existe usuario
    if(!usuario){
        req.flash('error', 'No valido');
        res.redirect('/restablecer');
    }

    //hashear el password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;
    //guardar en BD
    await usuario.save();
    
    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');


}