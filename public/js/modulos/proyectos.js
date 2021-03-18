import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){
    btnEliminar.addEventListener('click' , e => {    
        const urlPoryecto = e.target.dataset.proyectoUrl;
        
        Swal.fire({
            title: 'Deseas borrar este proyecto?',
            text: "No prodras recuperar el proyecto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borralo!',
            cancelButtonText: 'No, Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                //peticion a axios
                const url = `${location.origin}/proyectos/${urlPoryecto}`;
                
                axios.delete(url, { params: {urlPoryecto}})
                    .then(function(respuesta){
                        Swal.fire(
                            'Eliminaddo!',
                            respuesta.data,
                            'success'
                        );
                            
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 3000);
                    })
                    .catch(()=>{
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se puedo eliminar el proyecto'
                        })
                    })                                   
            }
        })
    })
}

export default btnEliminar;