let Project = require('./../models/projects');

// params middleware for id
exports.checkID = async function(req,res,next,val){
    let project = await Project.findById(val);
    if(!project){
        return res.status(404).json({
            status:'fail',
            message:'invalid id',
            redirectURL:'/todo-app'
        })
    }
    next()
}

// get all project
exports.getAllProjects = async function(req,res){
    try{
        let projects = await Project.find({userID});
        res.status(200).render("home",{projects,title:'home'}) 
    }
    catch(error){
        console.error(error.message);
        
        res.status(500).json({
            status:'fail',
            data:{
                message:'internal server failure'
            }
        })
    }
}
// get single project
exports.getProject = async function(req,res){
    try{
        let projectid = req.params.id;
        let completed = 0;
        let checked_todos;
        let unchecked_todos;        
        let project = await Project.findOne({userID,_id:projectid}).populate('list_of_todos');
        let project_date = project.created_date.toISOString().split('T')[0]
        let todos = project.list_of_todos;
        
        if(todos.length){
            function filterTodos(todos,status){
                return todos.filter(function(todo){
                    if(todo.status === status){
                        if(todo.status === true) completed += 1
                        return todo;
                    }
                })
            }
            unchecked_todos = filterTodos(todos,false)
            checked_todos = filterTodos(todos,true)

            console.log('pending:',unchecked_todos);
            console.log('completed:',checked_todos);
            
            
        }  

        res.status(200).render('project',{
            project,
            project_date,
            todos_length:todos.length,
            completed,
            unchecked_todos,
            checked_todos,
            title:'project'})
    }
    catch(error){
        console.log(error);        
        res.status(500).json({
            message:error
        })
    }
     
}

// creating project
exports.createProject = async function(req,res){
    try{
        let userID = req.session.userID;
        await Project.create({
            userID,
            title:req.body.title, 
            created_date:new Date()
        })
        res.status(200).json({
            status:'success',
            redirectURL:'/todo-app'
        })
    }
    catch(error){
        res.status(500).json({
            status:'fail',
            message:'project creation failed',
            redirectURL:'/todo-app'
        })
    } 
}

// edit a project
exports.editProject = async function(req,res){
    try{
        let projectid = req.params.id;
        let userID = req.session.userID;
        await Project.updateOne({userID,_id:projectid},{$set:req.body})
        res.status(200).json({
            status:'success',
            message:'project updated'
        })
    }
    catch(error){
        res.status(500).json({
            status:'fail',
            message:'failed to update project'
        })
    }
}

// delete a project
exports.deleteProject = async function(req,res){
    try{
        let userID = req.session.userID;
        let projectid = req.params.id;
        await Project.deleteOne({userID,_id:projectid});
        res.status(200).json({
            status:'success',
            message:'project deleted'            
        })
    }
    catch(error){
        res.status(500).json({
            status:'fail',
            redirectURL:'/todo-app'
        })
    }
    
}