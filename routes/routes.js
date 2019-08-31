var usuario = require('../controllers/usuario');
var formidable = require('formidable');
const fs = require('fs');
var url = require('url');
var rutas = function (app) {
    app.get('/registro', function (req, res) {
        res.render('registro');
    });
    app.get('/', function (req, res) {
        res.render('login');
    });
    app.get('/images', function (req, res) {
        var images = __dirname + '/../public/images/';
        var imageslist = [];
        fs.readdir(images, function (err, files) {
            files.forEach(function (file) {
                imageslist.push(file);
            });
            res.send(imageslist);
        });
    });
    app.get('/inicio', function (req, res) {
        res.render('index', {
            usuario: req.session.passport.user.nombre
        });
    });
    app.get('/error', function (req, res) {
        res.send(req.session.flash.error[0]);
    });
    app.post('/registro', usuario.registro, function (req, res) {
        res.redirect('/');
    });
    app.get('/subir-imagen', function (req, res) {
        res.render('subir-imagen');
    });
    app.get('/canvas', function (req, res) {
        var url_parts = url.parse(req.url, true);
        res.render('canvas', {
            usuario: req.session.passport.user.nombre,
            imagen: url_parts.query.imagen
        });
    });
    app.post('/subirImagen', function (req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req);
        form.on('fileBegin', function (name, file) {
            file.path = __dirname + '/../public/images/' + file.name;
        });
        res.redirect('/inicio');
    });
};
module.exports = rutas;