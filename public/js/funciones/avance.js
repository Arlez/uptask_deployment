import Swal from 'sweetalert2';

export const actualiarAvance = ()=>{
    //seleccionar tareas existentes
    const tareas = document.querySelectorAll('li.tarea');

    if(tareas.length){
        //seleccionar tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo');

        //calcular avance
        const avance = Math.round((tareasCompletas.length / tareas.length) * 100);


        //mostra avance
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance+'%';

        if(avance === 100){
            Swal.fire(
                'Completaste el Proyecto',
                'Felicidades!',
                'success'
            )
        }
    }

    

}