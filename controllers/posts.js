const Post = require('../models/post');
const router = require('express').Router();
const isAuthenticated = require('../utilities/auth');
// induces

// Index
router.get('/dashboard', (req, res) => {
    Post.find({}, (err, posts) => {
        res.render('posts/dashboard.ejs');
    });
});
// { posts, user: req.session.user }

// New
router.get('/posts/new', isAuthenticated, (req, res) => {
    res.render('posts/new.ejs');
});

// Delete

// Update

// Create
router.post('/posts', isAuthenticated, (req, res) => {
    req.body.author = req.session.user;
    Post.create(req.body, (err, post) => {
        res.redirect('/dashboard');
    });
});

// Edit

// Show


module.exports = router;