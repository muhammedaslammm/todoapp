let buttons = document.querySelectorAll('.button--add');
let signupInputs = document.querySelectorAll('.input');
let dialog = document.querySelector('.dialog');
let signupform = document.querySelector('.signup-form');
let loginform = document.querySelector('.login-form');
let dialogInput = document.getElementById('title')
let closeDialog = document.getElementById('closeDialog');
let submitDialog = document.getElementById('submitDialog');
let removeButton = document.querySelector('.button--remove')
let parentProject = document.querySelector('.projects');
let userLoggedIn = false;

// authenticating user
document.addEventListener('DOMContentLoaded',function(){
    fetch('/todo-app/user/check-auth')
    .then(function(res){
        return res.json();
    })
    .then(function(data){
        userLoggedIn = data.isLoggedIn;
    })
    .catch(function(error){
        console.log('checking user auth failed,',error);        
    })
})

// button click for adding project
buttons.forEach(function(button){
    button.addEventListener('click',function(event){
        event.preventDefault();
        if(userLoggedIn){
            dialog.showModal()
        }
        else{
            // signupform.style.opacity = 1
            signupform.style.display = 'block';
        }
    })
})

// signup
signupform.addEventListener('click',function(event){
    event.preventDefault();
    
    if(event.target.classList.contains('button--close')){
        signupform.style.display = 'none'
    }
    else if(event.target.classList.contains('button--register')){        
        let inputs = document.querySelectorAll('.input')
        let flag = true
        
        inputs.forEach(function(input){
            if(input.value.trim().length === 0){
                input.parentElement.querySelector('.error').innerText = 'Required field';
                flag = false
            }
        }) 
        if(flag){
            let form = document.querySelector('.form');
            let formdata = new FormData(form);
            fetch('/todo-app/user/register',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    username:formdata.get('username'),
                    password:formdata.get('password')
                })
            })
            .then(function(res){
                if(res.status === 409){
                    document.querySelector('.username .error').innerText = 'Username already taken';
                }else{
                    console.log('user registered');
                    userLoggedIn = true;
                    signupform.style.display = 'none'   

                    let message = document.querySelector('.notification--signup')
                    message.classList.add('show');

                    setTimeout(function(){
                        message.classList.remove('show');
                    },2000)
                }
                              
            })
            .catch(function(error){
                console.log('user registration failed');                
            })
        }
    }
})

signupInputs.forEach(function(input){
    input.addEventListener('keyup',function(event){
        input.parentElement.querySelector('.error').innerText = ''
    })
})


// submitting dialog
submitDialog.addEventListener('click',function(event){
    event.preventDefault()
    let project_title = document.getElementById('title');
    if(project_title.value.trim().length === 0){
        project_title.parentElement.querySelector('.title-error').innerText = 'Title must have atleast one character';
    }  
    else{
        let formData = {
            title:project_title.value
        }
        fetch('/todo-app',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(formData)
        })
        .then(function(res){
            if(res.status === 200){
                return res.json()
            }
            else if(res.status === 401){
                return res.json()
                .then(function(data){
                    dialog.close();                    
                    signupform.style.display = 'block';
                })
            }
        })
        .then(function(data){
            window.location.href = data.redirectURL;
        })
        .catch(function(error){
            console.log(error.message);            
        })
    }   
})
dialogInput.addEventListener('keyup',function(event){
    if(dialogInput.value.trim().length > 0){
        dialogInput.parentElement.querySelector('.title-error').innerText = ''
    }
})

dialogInput.addEventListener('keydown',function(event){
    if(event.key === 'Enter'){
        event.preventDefault();
        submitDialog.click()
    }
})

// closing dialog
closeDialog.addEventListener('click',function(event){
    event.preventDefault()
    dialog.close()
})

// removing project
parentProject.addEventListener('click',function(event){
    event.preventDefault();
    if(event.target.classList.contains('button--remove')){
        let projectElement = event.target.closest('.project');
        let projectid = projectElement.getAttribute('data-id');
        fetch(`/todo-app/${projectid}`,{
            method:'DELETE'
        }).then(function(response){
            if(!response.ok){
                throw new Error('failed to delete project')
            }
            return response.json()
        })
        .then(function(data){
            projectElement.remove();
        })
        .catch(function(error){
            window.location.href = error.redirectURL
        })
    }

    // opening project
    else if(event.target && event.target.classList.contains('project')){    
        if(userLoggedIn){
            let projectid = event.target.getAttribute('data-id'); 
            window.location.href = `todo-app/${projectid}`
        }    
        else{
            signupform.style.display = 'block'
        }
        
    }
})