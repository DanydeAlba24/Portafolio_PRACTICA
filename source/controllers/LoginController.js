const bcrypt = require('bcrypt');
const mysql = require ('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'recursos'
})

connection.connect(function(error){
    if(error){
        throw error;
    }
})

function login(req, res, next){
    if(req.session.loggedin != true){
        res.render('login/index');
    }else{
        res.redirect('/');
    }
}


function auth(req, res){
    const data = req.body;
    connection.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {
        if(userdata.length > 0){
            userdata.forEach(element => {
            bcrypt.compare(data.password, element.password, (err, isMatch) => {
                if(!isMatch){
                    res.render('login/index', {error: 'Error: ¡Contraseña incorrecta!'});
                }else{
                    req.session.loggedin = true;
                    req.session.name = element.name;
                    res.redirect('/');
                }    
                });
            })
        }else{
            res.render('login/index', {error: '¡Error: Este usuario no existe!'})
        } 
    });
}

function register(req, res, next){
    if(req.session.loggedin != true){
        res.render('login/register');
    }else{
        res.redirect('/');
    }
}

function storeUser(req, res, next){
    const data = req.body;
    connection.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {
        if(userdata.length > 0){
            res.render('login/register', {error: 'Error: ¡El E-mail ya se encuentra en uso!'})
        } else {
            bcrypt.hash(data.password, 12).then(hash =>{
            data.password= hash;

            connection.query('INSERT INTO users SET ?', [data], (err, rows) => {
                res.redirect('/');
                    });
                });
            }
        });
    }

function logout(req, res){
    if(req.session.loggedin == true){
        req.session.destroy();
    }else{
        res.redirect('/login');
    }
}

function auth(req, res){
    const data = req.body;
    connection.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {
        if(userdata.length > 0){
            userdata.forEach(element => {
            bcrypt.compare(data.password, element.password, (err, isMatch) => {
                if(!isMatch){
                    res.render('login/index', {error: 'Error: ¡Contraseña incorrecta!'});
                }else{
                    req.session.loggedin = true;
                    req.session.name = element.name;
                    res.redirect('/');
                }    
                });
            })
        }else{
            res.render('login/index', {error: '¡Error: Este usuario no existe!'})
        } 
    });
}

module.exports = {
    login,
    register,
    storeUser,
    auth,
    logout
}