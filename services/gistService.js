let axios = require('axios');

exports.createMarkDownSummary = function(title,completedTodos,pendingTodos,totalTodos,date){
    let text = `${title}\nCreated on ${date}\nSummary:${completedTodos.length}/${totalTodos} todos completed.\n`

    text += '\nPendings\n';
    for(let todo of pendingTodos){
        text += `[] ${todo.description}\n`
    }

    text += '\nCompleted\n'
    for(let todo of completedTodos){
        text += `[o] ${todo.description}\n`
    }

    text += '\n*double click on todos to edit or delete todos'

    return text;
}

exports.createSecretGist = async function(content,github_token,title,description){
    try{
        let url = 'https://api.github.com/gists'
        let data = {
            description,
            public:false,
            files:{
                'todo-app.md':{
                    content
                }
            }
        }

        let gistURL = await axios.post(url,data,{
            headers:{
                Authorization:`token ${github_token}`,
                'Content-Type':'application/json'
            }
        })
        console.log(gistURL.data);
        
        return content
    }
    catch(error){
        console.log(error.response ? error.response.data : error.message);
        throw new Error(`${error.message}`);
        
    }
}