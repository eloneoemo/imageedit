var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io')(server),
  redis = require('redis'),
  client = redis.createClient(),
  session = require('express-session'),
  RedisStore = require('connect-redis')(session),
  passport = require('passport'),
  flash = require('connect-flash'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  path = require('path'),
  _ = require('lodash'),
  swig = require('swig');

var usuarios = [];
var clientes = {};

var Usuario = require('./models/usuarios');
var Mensaje = require('./models/mensajes');

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.set('view cache', false);
swig.setDefaults({ cache: false });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store : new RedisStore({}),
  secret : 'nextapp'
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
   done(null, obj);
});

var routes = require('./routes/routes');
routes(app);

var local = require('./connections/local');
local(app);
var twitter = require('./connections/twitter');
twitter(app);

function storeMessages(usuario, mensaje){
  var objeto = new Mensaje({usuario : usuario, mensaje : mensaje});
  objeto.save(function (err, mensaje){
  });
};
io.on('connection', function(socket){  
  socket.on('disconnect', function(){
    client.hdel("usuarios", socket.id);
});
socket.on('mousedown', function (datos) {
    io.emit('mousedown', datos);
});
socket.on('mousemove', function (datos) {
    io.emit('mousemove', datos);
});
socket.on('mouseup', function (datos) {
    io.emit('mouseup', datos);
});
socket.on('mouseleave', function (datos) {
    io.emit('mouseleave', datos);
});
});
server.listen(3000, function(){
	console.log('Servidor corriendo en el puerto 3000');
});


