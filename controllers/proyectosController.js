const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');
const slug = require('slug');
//const { noExtendLeft } = require('sequelize/types/lib/operators');

exports.proyectosHome = async (req, res) => {

    const usuarioId = res.locals.usuario.id; 

    const proyectos = await Proyectos.findAll({where: {usuarioId}});

    res.render('index', {
        nombrePagina: "Proyectos",
        proyectos
    });
}

exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id; 
    const proyectos = await Proyectos.findAll({where: {usuarioId}});

    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id; 
    const proyectos = await Proyectos.findAll({where: {usuarioId}});

    // enviar a consola lo que se escriba
    //console.log(req.body);

    //validar datos de input
    const {nombre} = req.body;

    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agrega un Nombre al Proyecto'});
    }

    if(errores.length > 0){
        res.render('nuevoProyecto',{
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        });
    }else{
        //no hay erroes
        //insertar en la BD    
        const usuarioId = res.locals.usuario.id;    
        await Proyectos.create({nombre , usuarioId});
        res.redirect('/');
    }
}

exports.proyectoPorUrl = async (req, res) => {
    const usuarioId = res.locals.usuario.id; 
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);

    //consultar tareas del poroyecto actual

    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        }, 
        //include:[
        //    {model: Proyectos}
        //]
    })

    if(!proyecto) return next();

    //render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async (req, res) => {
    
    const usuarioId = res.locals.usuario.id; 
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise,proyectoPromise]);

    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    });
}

exports.actualizarProyecto = async (req, res) => {

    const usuarioId = res.locals.usuario.id; 
    const proyectos = await Proyectos.findAll({where: {usuarioId}});

    // enviar a consola lo que se escriba
    //console.log(req.body);

    //validar datos de input
    const {nombre} = req.body;

    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agrega un Nombre al Proyecto'});
    }

    if(errores.length > 0){
        res.render('nuevoProyecto',{
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        });
    }else{
        //no hay erroes
        //actualizar proyecto de la BD
        await Proyectos.update(
            {nombre: nombre},
            {where: { id: req.params.id }}
            );
        res.redirect('/');
    }
}

exports.eliminarProyecto = async (req, res, next) => {
    const {url} = req.params;

    const resultado = await Proyectos.destroy({where:{url: url}});

    if(!resultado) return next();

    res.send('Proyecto eliminado');
}