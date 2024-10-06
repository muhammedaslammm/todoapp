let Project = require('./../models/projects');
let Services = require('./../services/gistService');
require('dotenv').config()

exports.generateSummaryGist = async function(req,res){
    try{
        let projectid = req.params.id;
        let project = await Project.findById(projectid).populate('list_of_todos');
        let title = project.title;
        let date = project.created_date.toISOString().split('T')[0];

        let todos = project.list_of_todos;

        function filterTodos(todos,status){
            return todos.filter(todo => todo.status === status);
        }

        let completedTodos = filterTodos(todos,true);
        let pendingTodos = filterTodos(todos,false);

        let markdownContent = Services.createMarkDownSummary(title,completedTodos,pendingTodos,todos.length,date);
        let github_token = process.env.github_token;
        let gistContent = await Services.createSecretGist(markdownContent,github_token,title,`Summary of ${title}`);
        res.json({gistContent,title});        
    }
    catch(error){ 
        console.log(error);        
        res.status(500).json({
            error:error.message
        })     
    }
}