const Post = require('../models/post');
const router = require('express').Router();
const isAuthenticated = require('../utilities/auth');

router.get('/post', (req, res) => {
    Post.find({}, (err, posts) => {
        res.render('posts/index.ejs', { posts, user: req.session.user });
    });
});

router.get('/posts/new', isAuthenticated, (req, res) => {
    res.render('posts/new.ejs');
});



router.post('/posts', isAuthenticated, (req, res) => {
    req.body.author = req.session.user;
    Post.create(req.body, (err, post) => {
        res.redirect('/posts');
    });
});


module.exports = router;