const Post = require('../models/post');
const router = require('express').Router();
const isAuthenticated = require('../utilities/auth');

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
router.put("/posts/:id/", (req, res) => {
    Post.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
        res.redirect(`/posts/${req.params.id}`)
    }); 
}); 


// Create
router.post('/posts', isAuthenticated, (req, res) => {
    req.body.author = req.session.user;
    Post.create(req.body, (err, post) => {
        res.redirect('/dashboard');
    });
});

// Edit
router.get("/posts/:id/edit", (req, res) => {
    Post.findById(req.params.id, (err, foundPost) => {
      res.render("posts/edit.ejs", {
        post: foundPost,
      })
    })
});

// Show
router.get("/posts/:id", (req, res) => {
    Post.findById(req.params.id).sort('-_id').populate('author').exec((err, foundPost) => {
      res.render("posts/show.ejs", {
        post: foundPost,
      })
    })
});

module.exports = router;