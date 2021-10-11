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

// Routes INDUCES

// Show
router.get('/users/:id', (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        // res.render('users/show.ejs', {
        //     user: foundUser
        // });
        console.log(foundUser)
    });
});


module.exports = router;