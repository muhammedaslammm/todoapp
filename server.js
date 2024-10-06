let app = require('./app');
let mongoose = require('mongoose');
require('dotenv').config();

let connection_string = process.env.db_conn_str.replace('<db_pass>',process.env.db_pass);

let mongoconnect = mongoose.connect(connection_string)
mongoconnect.then(function(con){
    console.log('database connected');
    app.listen(process.env.port,function(){
        console.log(`server listening for request at port ${process.env.port} ...`);        
    })    
})
.catch(function(err){
    console.log('connection failed',err);    
})
