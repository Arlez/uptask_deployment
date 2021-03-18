const express = require('express');
const router = express.Router();

//instalar express validator npm i --save express-validator
//importa express validator
const { body } = require('express-validator/check');

//importa controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function(){
    //ruta para el home
    router.get('/',authController.usuarioAutenticado,proyectosController.proyectosHome); 

    router.get('/nuevo-proyecto', authController.usuarioAutenticado,proyectosController.formularioProyecto);
    router.post('/nuevo-proyecto', authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );

    router.get('/proyectos/:url', authController.usuarioAutenticado,proyectosController.proyectoPorUrl);

    //actualizar el proyecto
    router.get('/proyecto/editar/:id', authController.usuarioAutenticado,proyectosController.formularioEditar);
    router.post('/nuevo-proyecto/:id', authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );

    //eliminar proyecto
    router.delete('/proyectos/:url', authController.usuarioAutenticado,proyectosController.eliminarProyecto);

    //routes para las TAREAS
    router.post('/proyectos/:url', authController.usuarioAutenticado,tareasController.agregarTarea);


    //actualizar tarea
    router.patch('/tareas/:id', authController.usuarioAutenticado,tareasController.cambiarEstadoTarea);
    
    //borrando tarea
    router.delete('/tareas/:id', authController.usuarioAutenticado,tareasController.eliminarTarea);

    //crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmaCuenta);

    //iniciar sesion 
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario)

    //cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);

    //restablecer contraseña
    router.get('/restablecer', usuariosController.formRestablecerPassword);
    router.post('/restablecer', authController.enviarToken);
    router.get('/restablecer/:token', authController.validarToken);
    router.post('/restablecer/:token', authController.actualiazrPassword);

    return router;
}

