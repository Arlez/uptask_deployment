const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//extraer valores de variables.env
require('dotenv').config({path: 'variables.env'});
//const expressValidator = require('express-validator');

//importar helpers
const helpers = require('./helpers');

//crear cpmexion a l base de datos
const db = require('./config/db');

//importa el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(()=> console.log('Conectado al server'))
    .catch(error => console.log(error));

//crear app de express
const app = express();

//cargar archivos estaticos
app.use(express.static('public'));

//habilitar pug
app.set('view engine', 'pug');

//habilitar bodyparser para lear datos de formulario
app.use(bodyParser.urlencoded({extended:true}));

//añadir carpeta de vistar
app.set('views', path.join(__dirname, './views'))

app.use(cookieParser());

app.use(session({
    secret: 'secreto',
    resave: false,
    saveUninitialized: false
}));

//passport
app.use(passport.initialize());
app.use(passport.session()); 

//agregar flash messages
app.use(flash());

//pasar vardump
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});

app.use('/', routes());
//servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor esta funcionando')
});
