/**
 * Created by taylor on 20/12/16.
 */
var express = require('express');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var _ = require('underscore');
var port = process.env.PORT || 3000;
var app = express();

mongoose.connect('mongodb://localhost/imooc')

app.set('views', './views/pages');
app.set('view engine', 'jade');
var serveStatic = require('serve-static')
app.use(serveStatic('bower_components'))
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded())
app.locals.moment = require('moment');
app.listen(port);

console.log('imooc started on port ' + port);


//index page
app.get('/', function(req, res) {
    Movie.fetch(function (err, movies){
        if (err) {
            console.log(err)
        }

        res.render('index', {
            title: 'imooc 首页',
            movies: movies
        });
    });
});

//detail page
app.get('/movie/:id', function(req, res) {
    var id = req.params.id
    Movie.findById(id, function (err, movie){
        console.log('detail')
        console.log(movie)
        console.log('detail')
        res.render('detail', {
            title: 'imooc '+ movie.title,
            movie: movie
        });
    });
});

//admin page
app.get('/admin/movie', function(req, res) {
    res.render('admin', {
        title: 'imooc 后台录入页',
        movie: {
            title: '',
            director: '',
            country: '',
            year: '',
            poster: '',
            flash: '',
            summary: '',
            language: ''
        }
    });
});

//admin update movie from list
app.get('/admin/update/:id', function(req, res) {
    var id = req.params.id

    if (id) {
        Movie.findById(id, function(err, movie) {
            res.render('admin', {
                title: 'imooc 后台更新页',
                movie: movie
            });
        });
    }
});

//admin post movie
app.post('/admin/movie/new', function(req, res) {
    var id = req.body.movie._id
    var movieObj = req.body.movie
    var _movie;

    if (id !== 'undefined') {
        Movie.findById(id, function(err, movie) {
            if (err){
                console.log(err)
            }

            //movie查询的， movieObj是post的
            _movie = _.extend(movie, movieObj);
            _movie.save(function(err, movie) {
                if (err){
                    console.log(err);
                }

                res.redirect('/movie/' + movie._id);
            });
        });
    } else {
        _movie = new Movie({
            director: movieObj.director,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });

        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }

            res.redirect('/movie/' + movie._id);
        });
    }
});

//list page
app.get('/admin/list', function(req, res) {
    Movie.fetch(function(err, movies) {
        if (err) {
            console.log(err)
        }

        res.render('list', {
            title: 'imooc 列表页',
            movies: movies
        });
    });
});