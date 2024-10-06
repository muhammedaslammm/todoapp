let addButtons = document.querySelectorAll('.button--add');
let dialog = document.querySelector('.dialog')
let dialogInput = document.getElementById('todo_input');
let dialogSubmit = document.querySelector('.button--submit')
let dialogClose = document.querySelector('.button--close');
let todos = document.querySelector('.todos');


// add todo
document.querySelector('.project').addEventListener('click',function(event){
    if(event.target.classList.contains('button--add')){
        event.preventDefault();
        dialog.showModal();
    }
    else if(event.target.classList.contains('button--gist')){
        event.preventDefault()
        let projectid = event.target.closest('.project').getAttribute('data-id');
        fetch(`/todo-app/gist/upload/${projectid}`,{
            method:'POST',
        })
        .then(function(response){
            if(response.ok){
                return response.json();
            }
            else{
                return response.json().then(function(error){
                    throw new Error(`${error}`);
                })
            }
        })
        .then(function(data){
            let gistBlob = new Blob([data.gistContent],{type:'text/markdown'});
            let gisturl = URL.createObjectURL(gistBlob);
            // im here

            let a = document.createElement('a');
            a.href = gisturl;
            a.download = `${data.title}.md`

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);           

        })
        .catch(function(error){
            console.log('error:',error);
            
        })
        
    }
})

// edit title
let projectname = document.querySelector('.project__name');
projectname.addEventListener('click',function(event){    
    event.target.setAttribute('contenteditable','true')
    event.target.focus()
})

async function updateName(text,projectid){
    fetch(`/todo-app/${projectid}`,{
        method:'PATCH',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({title:text})
    }).then(function(res){
        return res.json();
    }).then(function(data){
        console.log(data);        
    })
    .catch(function(error){
        console.log(error.message);        
    })
}

projectname.addEventListener('blur',async function(event){
    let text = event.target.innerText;
    let projectid = event.target.closest('.project').getAttribute('data-id'); 
    event.target.removeAttribute('contenteditable')
    await updateName(text,projectid)   
})
projectname.addEventListener('keydown',async function(event){
    if(event.key === 'Enter'){
        event.preventDefault();
        event.target.removeAttribute('contenteditable');

        let text = event.target.innerText;
        let productid = event.target.closest('.project').getAttribute('data-id');
        await updateName(text,productid);
    }
})

// dialog box closing
dialogClose.addEventListener('click',function(event){
    dialog.close()
})

// dialog box submission
dialogSubmit.addEventListener('click',function(event){
    event.preventDefault();
    if(dialogInput.value.trim().length === 0){
        dialogInput.closest('.form__input').querySelector('.input-error').innerText = 'Todo cannot be empty';
    }
    else{
        let projectid = dialog.getAttribute('data-id');
        let formData = {
            description:dialogInput.value.trim(),
            projectid
        }
        fetch('/todo-app/todo',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(formData)            
        })
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            let empty_section = document.querySelector('.todos__empty')
            let todos = document.querySelector('.todos');
            let todos_count_p = todos.querySelector('.todos__count');
            let pending__section = todos.querySelector('.pending__section');
            let completed__section = todos.querySelector('.completed__section');
            let completed__section__head = todos.querySelector('.completed__section__head');
            let pending__section__head = todos.querySelector('.pending__section__head');
            document.querySelector('.todo__instruction').style.display = 'block';
            localStorage.setItem('todo__instruction','block');
            
            dialogInput.value = ''
            dialog.close();

            //checking for empty section
            if(empty_section){
                empty_section.remove()
            }

            // todos count
            if(!todos_count_p){
                todos_count_p = document.createElement('p');
                todos_count_p.classList.add('todos__count');
                todos.appendChild(todos_count_p);

                let completed_text = document.createTextNode('Summary: ');
                todos_count_p.appendChild(completed_text)

                let completedCount = document.createElement('span');
                completedCount.classList.add('count--completed');
                todos_count_p.appendChild(completedCount)

                let sepChar = document.createTextNode('/');
                todos_count_p.appendChild(sepChar);

                let totalCount = document.createElement('span');
                totalCount.classList.add('count--total');
                todos_count_p.appendChild(totalCount);

                let finaltext = document.createTextNode(' todos completed');
                todos_count_p.appendChild(finaltext)
            }
            document.querySelector('.count--completed').innerText = data.data.completed;
            document.querySelector('.count--total').innerText = data.data.todo_length;


            // checking and adding pending section and handling the empty para
            if(!pending__section){
                pending__section = document.createElement('div');
                pending__section.classList.add('pending__section');
                todos.appendChild(pending__section);
            }
            if(pending__section.querySelector('.todo__pending__empty')){
                pending__section.querySelector('.todo__pending__empty').remove()
            }


            // checking and adding completed section
            if(!completed__section){
                completed__section = document.createElement('div');
                completed__section.classList.add('completed__section');
                todos.appendChild(completed__section);
            }

            // adding head for both pending and completed sections
            if(!pending__section__head){
                pending__section__head = document.createElement('div');
                pending__section__head.classList.add('pending__section__head');
                pending__section__head.textContent = 'Pendings';
                pending__section.appendChild(pending__section__head);
            }
            if(!completed__section__head){
                completed__section__head = document.createElement('div');
                completed__section__head.classList.add('completed__section__head');
                completed__section__head.textContent = 'Completed';
                completed__section.appendChild(completed__section__head);
            }

            // adding todos
            let todo__pending = document.createElement('div');
            todo__pending.setAttribute('data-id',data.data._id)
            todo__pending.classList.add('todo__pending');

            let pending__checkbox = document.createElement('input');
            pending__checkbox.classList.add('pending__checkbox');
            pending__checkbox.type = 'checkbox';

            let label = document.createElement('label');
            label.classList.add('pending__head');
            label.classList.add('head')
            label.textContent = data.data.description

            todo__pending.appendChild(pending__checkbox);
            todo__pending.appendChild(label)

            pending__section.appendChild(todo__pending);


            // handling empty para in completed section           
            
            if(!completed__section.querySelector('.todo__completed')){
                if(!completed__section.querySelector('.todo__completed__empty')){
                    let todo__completed__empty = document.createElement('p');
                    todo__completed__empty.classList.add('todo__completed__empty');
                    todo__completed__empty.textContent = 'No task completed';
                    completed__section.appendChild(todo__completed__empty);
                }
            }

        })
        .catch(function(error){
            console.log('error:',error.message);            
        })
    }

})
// fetching for updating todos
async function updateTodo(id,projectid,text){
    fetch(`/todo-app/todo/${id}/${projectid}`,{
        method:'PATCH',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({description:text})
    })
    .then(function(res){
        console.log('todo updated');        
    })
    .catch(function(err){
        console.error('updation failed',err);        
    })
    
}
// fetching to delete todos
async function deleteTodo(projectid,todoid,parent){
    fetch(`/todo-app/todo/${todoid}/${projectid}`,{
        method:'DELETE'
    })
    .then(function(res){
        return res.json()
    })
    .then(function(data){           
        parent.remove()    
        document.querySelector('.count--completed').innerText = data.data.completed;
        document.querySelector('.count--total').innerText = data.data.todos_length;

        let pending__section = document.querySelector('.pending__section');
        let completed__section = document.querySelector('.completed__section');  

        if(!pending__section.querySelector('.todo__pending') && !completed__section.querySelector('.todo__completed')){
            document.querySelector('.todos__count').remove()
            pending__section.remove();
            completed__section.remove();

            let todos__empty = document.createElement('p');
            todos__empty.classList.add('todos__empty');
            todos__empty.textContent = 'No todos added to this project. '

            let button_add = document.createElement('a');
            button_add.classList.add('button--add');
            button_add.href = '#';
            button_add.textContent = 'Add Todo';

            todos__empty.appendChild(button_add);
            todos.appendChild(todos__empty);

            localStorage.removeItem('todo__instruction');
            let instruciton_state = localStorage.getItem('todo__intruction')
            document.querySelector('.todo__instruction').style.display = instruciton_state ? instruciton_state : 'none'
        }
        else if(!pending__section.querySelector('.todo__pending')){
            if(!pending__section.querySelector('.todo__pending__empty')){
                let todo__pending__empty = document.createElement('p');
                todo__pending__empty.classList.add('todo__pending__empty');
                todo__pending__empty.textContent = 'All tasks completed'

                pending__section.appendChild(todo__pending__empty)
            }            
        }
        else{
            if(!completed__section.querySelector('.todo__completed__empty')){
                let todo__completed__empty = document.createElement('p');
                todo__completed__empty.classList.add('todo__completed__empty');
                todo__completed__empty.textContent = 'No task completed';

                completed__section.appendChild(todo__completed__empty)
            }            
        }
    })
    .catch(function(err){
        console.error('failed to delete the todo',err);               
    })
}
// updating and deleting todos
todos.addEventListener('dblclick',function(event){
    event.preventDefault();  

    if(event.target.classList.contains('head')){
        event.target.setAttribute('contenteditable','true')
        event.target.focus()      
        
        let todoid = event.target.parentElement.getAttribute('data-id');
        let projectid = event.target.closest('.todos').getAttribute('data-projectid');
        let parent = event.target.parentElement
    
        event.target.addEventListener('blur',async function(event){     
            let text = event.target.innerText.trim();     
            if(text.length){
                await updateTodo(todoid,projectid,text);
            }else{
                await deleteTodo(projectid,todoid,parent)
            }
            
        })

        event.target.addEventListener('keydown',async function(event){
            let text = event.target.innerText.trim();  
            if(event.key === 'Enter'){
                event.preventDefault();
                event.target.removeAttribute('contenteditable');
    
                if(text.length){
                    await updateTodo(todoid,projectid,text)
                }else{
                    await deleteTodo(projectid,todoid,parent)
                }                
            }
        })
    }

    
    
})

// submitting checkbox
todos.addEventListener('click',function(event){
    if(event.target.classList.contains('pending__checkbox')){
           let projectid = event.target.closest('.todos').getAttribute('data-projectid');
           let todo__pending = event.target.closest('.todo__pending');
           let todoid = todo__pending.getAttribute('data-id');
           fetch(`/todo-app/todo/${todoid}/${projectid}`,{
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({status:true})
           })
           .then(function(response){
                return response.json()
           })
           .then(function(data){
                todo__pending.remove()
                let pending__section = todos.querySelector('.pending__section');
                let completed__section = todos.querySelector('.completed__section');

                document.querySelector('.count--completed').textContent = data.data.completed;
                document.querySelector('.count--total').textContent = data.data.todos_length;

                if(completed__section.querySelector('.todo__completed__empty')){
                    completed__section.querySelector('.todo__completed__empty').remove()
                }

                let todo__completed = document.createElement('div');
                todo__completed.classList.add('todo__completed');
                todo__completed.setAttribute('data-id',data.data._id);

                let completed__checkbox = document.createElement('input');
                completed__checkbox.classList.add('completed__checkbox');
                completed__checkbox.type = 'checkbox';
                completed__checkbox.checked = true;

                let completed__head = document.createElement('label');
                completed__head.classList.add('completed__head');
                completed__head.classList.add('head');
                completed__head.textContent = data.data.description;

                todo__completed.appendChild(completed__checkbox);
                todo__completed.appendChild(completed__head);

                completed__section.append(todo__completed);

                // pending section               

                if(!pending__section.querySelector('.todo__pending')){
                    if(!pending__section.querySelector('.todo__pending__empty')){
                        let todo__pending__empty = document.createElement('p');
                        todo__pending__empty.classList.add('todo__pending__empty');
                        todo__pending__empty.textContent = 'All tasks completed';
                        pending__section.appendChild(todo__pending__empty)
                    }
                }
           })
           .catch(function(error){
                console.error(error.message);                
           })
    }
    else if(event.target.classList.contains('completed__checkbox')){
        let projectid = event.target.closest('.todos').getAttribute('data-projectid');        
        let todo__completed = event.target.closest('.todo__completed');
        let todoid = todo__completed.getAttribute('data-id');
        fetch(`/todo-app/todo/${todoid}/${projectid}`,{
            method:'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({status:false})
        })
        .then(function(res){
            return res.json()
        })
        .then(function(data){
            todo__completed.remove();
            let pending__section = todos.querySelector('.pending__section');
            let completed__section = todos.querySelector('.completed__section');

            document.querySelector('.count--completed').textContent = data.data.completed;
            document.querySelector('.count--total').textContent = data.data.todos_length;

            if(pending__section.querySelector('.todo__pending__empty')){
                pending__section.querySelector('.todo__pending__empty').remove()
            }

            let todo__pending = document.createElement('div');
            todo__pending.classList.add('todo__pending');
            todo__pending.setAttribute('data-id',data.data._id);

            let pending__checkbox = document.createElement('input');
            pending__checkbox.classList.add('pending__checkbox');
            pending__checkbox.type = 'checkbox';

            let pending__head = document.createElement('label');
            pending__head.classList.add('pending__head');
            pending__head.classList.add('head')
            pending__head.textContent = data.data.description;

            todo__pending.appendChild(pending__checkbox)
            todo__pending.appendChild(pending__head)

            pending__section.appendChild(todo__pending);

            // completed section
            if(!completed__section.querySelector('.todo__completed')){
                if(!completed__section.querySelector('.todo__completed__empty')){
                    let todo__completed__empty = document.createElement('p')
                    todo__completed__empty.classList.add('todo__completed__empty');
                    todo__completed__empty.textContent = 'No task completed';
                    completed__section.appendChild(todo__completed__empty);
                }
            }
            
        })
        .catch(function(error){
            console.log(error.message);            
        })
    }    
})

// dialog input box events
dialogInput.addEventListener('keyup',function(event){
    if(dialogInput.value.trim().length > 0){
        dialogInput.closest('.form__input').querySelector('.input-error').innerText = ''
    }
})
dialogInput.addEventListener('keydown',function(event){
    if(event.key === 'Enter'){
        event.preventDefault();
        dialogSubmit.click();
    }
})

// page reload
document.addEventListener('DOMContentLoaded',function(){
    document.querySelector('.todo__instruction').style.display = localStorage.getItem('todo__instruction')
})

