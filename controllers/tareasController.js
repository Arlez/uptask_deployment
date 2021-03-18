const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas')

exports.agregarTarea = async (req, res, next) => {

    //consulta a la BD, obtener proyecto actual
    const proyecto = await Proyectos.findOne({where: {url: req.params.url}});

    // leer el valor del input
    const {tarea} = req.body;

    //estado 0 = incompleto
    const estado = 0;
    //id del proyecto
    const proyectoId = proyecto.id;

    //insertar en la BD
    const resultado = await Tareas.create({tarea,estado,proyectoId});

    if(!resultado)return next();

    //redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
}

exports.cambiarEstadoTarea= async (req, res, next) => {
  
    const {id} = req.params;
    const tarea = await Tareas.findOne({where: {id}});

    //cambiar el estado
    let estado = 0;

    if(tarea.estado === estado){
        estado = 1;
    }
    
    tarea.estado = estado;

    const resultado = await tarea.save();

    if(!resultado){
        return next();
    }

    res.status(200).send('Actualizando');
}

exports.eliminarTarea = async (req, res) =>{

    const { id } = req.params;

    //eliminar tarea

    const resultado = await Tareas.destroy({where: { id }});

    if(!resultado) return next();

    res.status(200).send('Ejecución completada');
}