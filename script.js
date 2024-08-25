    const url = 'http://localhost:3000/api/task/';
    const container = document.querySelector('tbody')
    let result = ''


    const modalArticle = new bootstrap.Modal(document.getElementById('modalArticle'))
    const formArticle = document.querySelector('form')
    const task = document.getElementById('task')
    const description = document.getElementById('description')
    const status = document.getElementById('status')
    const btncreate = document.getElementById('btncreate')

    let option = ''
    let idForm = 0;

    // Limpia el formulario y muestra el modal al hacer clic en el botón de crear
    btncreate.addEventListener('click', () => {
        task.value = ''
        description.value = ''
        modalArticle.show()
        option = 'create'

    });;


    const view = (articles) => {
        result = ''; // Asegúrate de inicializar result
        articles.forEach(article => {
            result += 
                    `<tr>
                    <td>${article.id}</td>
                    <td>${article.task}</td>
                    <td>${article.description}</td>
                    <td>${article.status}</td>
                    <td class="text-center"><a class="btnedit btn btn-primary">EDIT</a><a class="btndelete btn btn-danger">DELETE</a></td>
                </tr>
                `;
        });
        container.innerHTML = result;
    }
    
//process view
fetch(url)
    .then( response  => response.json())
    .then(data =>view(data))
    .catch(error =>console.log(error))


    const on = (element, event, selector, handler) =>{
        element.addEventListener(event, e =>{
            if(e.target.closest(selector)){
                handler(e)
            }
        })
    }

    on(document, 'click', '.btndelete', e =>{
        const row = e.target.parentNode.parentNode
        const id = row.firstElementChild.innerHTML
        alertify.confirm("¿Estas seguro que deseas borrar esta tarea?",
            function(){
                fetch(url+id,{
                    method:'DELETE'
                })
                .then(res => res.json() )
                .then(()=> location.reload())
              //alertify.success('Ok,tarea eliminada 😌')
            },
            function(){
              alertify.error('Cancel 😎')
            })
    });


    on(document, 'click', '.btnedit', e => {
        const row = e.target.parentNode.parentNode
        
        // Declaración de variables correctamente
        const idForm = row.children[0].innerHTML
        const taskForm = row.children[1].innerHTML
        const descriptionForm = row.children[2].innerHTML
        const statusForm = row.children[3].innerHTML
    
        // Asignar valores a los campos del formulario
        document.getElementById('task').value = taskForm
        document.getElementById('description').value = descriptionForm
    
        // Si status es un campo select, se asigna su valor
        const statusSelect = document.getElementById('status')
        statusSelect.value = statusForm

        option = 'edit'
        modalArticle.show()
    });

    //crear y editar 
    formArticle.addEventListener('submit', (e) => {
        e.preventDefault();
        const status = document.getElementById('status')
        
        // Verifica si está creando o editando
        if (option == 'create') {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    task: task.value,
                    description: description.value
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => Promise.reject(err));
                }
                return response.json();
            })
            .then(data => {
                console.log('Tarea creada:', data); // Verifica los datos devueltos
                const newtask = [data];
                view(newtask);
            })
            .catch(error => console.error('Error al crear tarea:', error));
        }
        
    
    //     if (option == 'edit') {    
    //         fetch(url + idForm, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 task: task.value,
    //                 description: description.value,
    //                 status: status.value
    //             })
    //         })
    //         .then(response => response.json())
    //         //.then(() => location.reload())
    //         .catch(error => console.log(error));
    //     }
    
    //     modalArticle.hide();
     });
    
    


