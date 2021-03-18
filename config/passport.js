const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//referencia al modelo a auntenticar
const Usuarios = require('../models/Usuarios');

//local strategy - login con credenciales propios (usuario y password)
passport.use(
    new LocalStrategy(
        //por default passport espara un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: { 
                        email,
                        activo: 1
                    }
                })
                //el usuario existe pero pass incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Password incorrecto'
                    })
                }
                //el email existe y el password es correcto
                return done(null,usuario);
            } catch (error) {
                //ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
);



//serializar usuario
passport.serializeUser((usuario, callback) => {
    callback(null,usuario);
})

//deserializar usuario
passport.deserializeUser((usuario, callback) => {
    callback(null,usuario);
})

//exportar
module.exports = passport;