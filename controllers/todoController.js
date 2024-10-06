let Todo = require('./../models/todoModel');
let Project = require('./../models/projects');

exports.addTodo = async function(req,res){
    try{
        let {projectid, description} = req.body;
        console.log('projectid:',projectid,'| description:',description);

        let newTodo = await Todo.create({
            description,
            created_date:new Date(),            
        })
        await Project.updateOne({userID,_id:projectid},{$push:{list_of_todos:newTodo._id}},{new:true});
        let project = await Project.findOne({userID,_id:projectid}).populate('list_of_todos');
        let todos = project.list_of_todos;
        let completed = todos.filter(todo => todo.status).length;


        res.status(200).json({
            status:'success',
            data:{
                _id:newTodo._id,
                description:newTodo.description,
                status:newTodo.status,
                todo_length:todos.length,
                completed         
            }
        })
    }
    catch(error){
        console.log(error);        
        res.status(500).json({
            status:'fail',
            message:`something went wrong. ${error.message}`
        })
    }
    
}

// update todo
exports.updateTodo = async function(req,res){
    try{
        let {id,projectid} = req.params;
        console.log(req.params);
        
        req.body.updatedDate = new Date();
        console.log('updated_date:',req.body.updatedDate); 
        console.log('todoid:',id);
         
            
        let updatedTodo = await Todo.findByIdAndUpdate(id,req.body,{new:true});
        let project = await Project.findOne({userID,_id:projectid}).populate('list_of_todos');
        let todos = project.list_of_todos;
        let completed = todos.filter(todo => todo.status).length
              
        res.status(200).json({
            status:'success',
            data:{
                _id:updatedTodo._id,
                description:updatedTodo.description,  
                completed:completed,
                todos_length:todos.length           
            }
        })
    }
    catch(error){
        console.log(error);        
        res.status(500).json({
            status:'fail',
            message:error.message
        })
    }
    
}

// delete todo
exports.deleteTodo = async function(req,res){
    try{
        let {id,projectid} = req.params;
        await Todo.findByIdAndDelete(id);
        await Project.updateOne({userID,_id:projectid},{$pull:{list_of_todos:id}});

        console.log('projectid:',projectid);
        
        let project = await Project.findOne({userID,_id:projectid}).populate('list_of_todos');
        console.log('project:',project);
        
        let todos = project.list_of_todos;
        let completed = todos.filter(todo => todo.status).length;
        console.log('completed:',completed);
        

        res.status(200).json({
            message:"success",
            data:{
                completed,
                todos_length:todos.length
            }

        })
    }
    catch(error){
        console.log(error);        
        res.status(500).json({
            message:"fail"
        })
    }
}