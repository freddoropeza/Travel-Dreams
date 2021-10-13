const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Post = require('../models/post');
const isAuthenticated = require('../utilities/auth');


router.get('/users/delete', async (req, res) => {
    await User.deleteMany({});
    res.redirect('/');
});

// present user with login page
router.get('/login', (req, res) => {
    res.render('login.ejs', { error: '' });
});

// handle form submission to login
router.post('/login', (req, res) => {
    User.findOne({ username: req.body.username }, (err, foundUser) => {
        if(!foundUser) {
            return res.render('login.ejs', {error: 'Invalid Credentials'});
        }
        const isMatched = bcrypt.compareSync(req.body.password, foundUser.password);
        if(!isMatched) {
            return res.render('login.ejs', {error: 'Invalid Credentials'});
        }
        req.session.user = foundUser._id;
        res.redirect('/dashboard')
    });
});

// present user with signup page
router.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

router.post('/signup', (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  User.create(req.body, (err, user) => {
      req.session.user = user._id
      res.redirect('/dashboard');
  });
});

router.get('/signout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

// Protected Route
router.get('/dashboard', isAuthenticated, (req, res) => {
    Post.find({}).sort('-_id').exec(function(err, foundPosts) {
        res.render('dashboard.ejs', {
            posts: foundPosts
        });
    });
});

// Routes 

// Show User Profile
router.get('/users/:id', isAuthenticated, (req, res) => {
    Post.find({author: req.params.id}).populate('author').exec(function(err, foundPosts) {
        console.log(foundPosts)
        res.render('users/show.ejs', {
            posts: foundPosts,
            user: req.session.user,
        });
        console.log(req.session.user)
    });
});


// router.get('/users/:id', isAuthenticated, (req, res) => {
//     User.findById(req.session.user, (err, user) => {
//         Post.find({author: req.params.id}).populate('author').exec(function(err, foundPosts) {
//             res.render('users/show.ejs', {
//                 posts: foundPosts,
//                 user,
//             });
//             console.log(foundPosts)
//             console.log(req.session.user)
    
//     });
// });
// })

module.exports = router;