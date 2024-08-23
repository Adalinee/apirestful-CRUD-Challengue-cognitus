const url = 'http://localhost:3000/api/articulos/';
const contenedor = document.querySelector('tbody');
let result = '';

const modalArticle = new bootstrap.Modal(document.getElementById('modalArticle'));
const formArticle = document.querySelector('form');
const task = document.getElementById('task');
const description = document.getElementById('description');

let option = 

btncreate.addEventListener('click', ()=>{
    task.value = ''
    description.value = ''
    modalArticl.show()
});


const view = (articles) => {
    articles.forEach(article => {

    result += 
                <tr>
                    <td>${article.id}</td>
                    <td>${article.task}</td>
                    <td>${article.description}</td>
                    <td class="btn-edit"></td>
                    <td class="btn-delete"></td>
                </tr>
    });
    contenedor.innerHTML = result

}

//process view
fetch(url)
    .then( response  => response.json())
    .then(data =>mostrar(data))
    .catch(error =>console.log(error))
