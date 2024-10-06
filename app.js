let express = require('express');
let app = express();

let session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config()
let homeRouter = require('./routers/homeRouter');
let todoRouter = require('./routers/todoRouter');
let userRouter = require('./routers/userRouter');
let gistRouter = require('./routers/gistRouter')

app.set('view engine','ejs')
app.use(express.json());
app.use(express.static('public'));

app.use(session({
    secret:'th1s1s535510ns3cret',
    saveUninitialized:false,
    resave:false,
    store:MongoStore.create({mongoUrl:process.env.db_conn_str.replace('<db_pass>',process.env.db_pass)}),
    cookie:{maxAge:1000*60*60*24}
}))


app.use('/todo-app',homeRouter);
app.use('/todo-app/todo',todoRouter);
app.use('/todo-app/user',userRouter);
app.use('/todo-app/gist/upload',gistRouter)

module.exports = app