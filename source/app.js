const express = require('express');
const { engine } = require('express-handlebars');
const cors = require('cors');
const mysql = require ('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const loginRoutes = require('./routes/login');
const app = express();

app.set('port', 4000);

app.listen(app.get('port'), () => {
    console.log('El servidor está corriendo', app.get('port'));
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'recursos'
});

connection.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log("Conectada la base de datos correctamente");
    }
});

app.set('views', __dirname + '/views');
app.engine('.html', engine ({
    extname: '.html',
}))

app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', loginRoutes);

app.get('/', (req, res) =>{
    if(req.session.loggedin == true){
        res.render('home', {name: req.session.name});
    }else{
        res.redirect('/login')
    }
    
});