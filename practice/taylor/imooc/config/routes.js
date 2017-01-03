/**
 * Created by taylor on 02/01/17.
 */
var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Movie = require('../app/controllers/movie');

module.exports = function(app) {
    // pre-handling user session
    app.use(function(req, res, next) {
        var _user = req.session.user;
        app.locals.user = _user;

        return next();
    });

    // Index
    app.get('/', Index.index);

    // User
    app.post('/user/signup', User.signup);
    app.post('/user/signin', User.signin);
    app.get('/logout', User.logout);
    app.get('/admin/userlist', User.list);

    // Movie
    app.get('/movie/:id', Movie.detail);
    app.get('/admin/movie/new', Movie.new);
    app.get('/admin/update/:id', Movie.update);
    app.post('/admin/movie/save', Movie.save);
    app.get('/admin/list', Movie.list);
    app.delete('/admin/list', Movie.delete);
};