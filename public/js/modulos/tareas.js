import axios from "axios";
import Swal from "sweetalert2";
import { actualiarAvance } from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if(tareas){

    tareas.addEventListener('click', e => {
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            
            //request /tareas/:id

            const url = `${location.origin}/tareas/${idTarea}`;

            axios.patch(url, {idTarea})
                .then(function(respuesta){
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo')

                        actualiarAvance();
                    }
                })
        }

        if(e.target.classList.contains('fa-trash')){
            const tareaHTML = e.target.parentElement.parentElement,
                    idTarea = tareaHTML.dataset.tarea;
            
            Swal.fire({
                title: 'Deseas borrar este Tarea?',
                text: "No prodras recuperar la Tarea",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Borralo!',
                cancelButtonText: 'No, Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    const url = `${location.origin}/tareas/${idTarea}`;
                    
                    // enviar delete por axios
                   axios.delete(url, {params: {idTarea}})
                   .then(function(respuesta){
                        if(respuesta.status === 200){
                            //eliminar el nodo
                            tareaHTML.parentElement.removeChild(tareaHTML);

                            //opcional alerta

                            Swal.fire(
                                'Tarea Eliminada',
                                respuesta.data,
                                'success'
                            )

                            actualiarAvance();
                        }
                   })   
                }
            })
        }
    });

}

export default tareas;


