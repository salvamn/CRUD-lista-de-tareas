$(document).ready(function(){
    var altoVentana = $(window).height()
    var divContenedorTarea = $("#contenedor-crear-tarea").css("height", altoVentana)
    var divContenedorMostrarTareas = $("#contenedor-mostrar-tareas").css("height", altoVentana)


    var btnCrearTarea = $("#crear-tarea")
    btnCrearTarea.on("click", function(){
        var nombre = document.getElementById("nombre-tarea").value
        var contenido = document.getElementById("contenido-tarea").value
        
        $.ajax({
            url: `/registrar-tarea/${nombre}/${contenido}`,
            success: function(data){
                $("#nombre-tarea").val("")
                $("#contenido-tarea").val("")
                mostrarTareas()
            },
            error: function(e){
                console.log(e)
            }
        });
    })
    
    
    function mostrarTareas(){
        document.getElementById("tarea").innerHTML = ""
        fetch("/mostrar-tareas", {
            method: "POST"
        })
        .then( response => response.json() )
        .then(data => {
            var divTarea = document.getElementById("tarea")   

            for(let llave in data){
                if(data[llave]["estado"] == 1)
                    divTarea.innerHTML += (
                        `
                        <div
                        style="background-color: rgba(29, 29, 29, 0.233);"
                        class='contenedor-tarea-id' id=${data[llave]['id']}>
                            <h4>${data[llave]['nombre_tarea']}</h4>
                            <span>${data[llave]['fecha']}</span>
                            <div class='div-btn'>
                                <button id='${data[llave]['id']}' class='btn-mostrar btn-opcion'>Mas</button>
                                <button id='${data[llave]['id']}' class='btn-eliminar btn-opcion'>Eliminar</button>
                            </div>
                        </div>
                        `
                    )
                else{
                    divTarea.innerHTML += (
                        `
                        <div class='contenedor-tarea-id' id=${data[llave]['id']}>
                            <h4>${data[llave]['nombre_tarea']}</h4>
                            <span>${data[llave]['fecha']}</span>
                            <div class='div-btn'>
                                <button id='${data[llave]['id']}' class='btn-mostrar btn-opcion'>Mas</button>
                                <button id='${data[llave]['id']}' class='btn-eliminar btn-opcion'>Eliminar</button>
                            </div>
                        </div>
                        `
                    )
                }
            }
        })
    }


    

    $(document).on("click", ".btn-mostrar", function(){
        var idBtn = $(this).prop("id")
        var url = `/mostrar-tarea-id/${idBtn}`
        fetch(url)
        .then(response => response.json())
        .then(data => {
            Swal.fire({
                title: data["nombre_tarea"],
                text: data["contenido_tarea"],
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Completar tarea'
            })
            .then( ( result ) => {
                if(result.isConfirmed){
                    var urlActualizar = `/actualizar-tarea/${idBtn}`
                    fetch(urlActualizar)
                    .then(response => response.json())
                    .then(function(data){
                        toastr.success('Tarea completada', 'Completado')
                        mostrarTareas()
                    })
                }
            })

        })
    })



    $(document).on("click", ".btn-eliminar", function(){
        var idBtn = $(this).prop("id")
        
        Swal.fire({
            title: 'Deseas eliminar la tarea?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borralo!'
          }).then((result) => {
            if (result.isConfirmed) {
                var urlEliminar = `/eliminar-tarea/${idBtn}`

                fetch(urlEliminar)
                .then(response => response.json())
                .then(function(data){
                    toastr.success('Tarea eliminada', 'Eliminada')
                    mostrarTareas()
                })
            }
          })

        
    })


})