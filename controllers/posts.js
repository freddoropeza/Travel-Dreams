const Post = require('../models/post');
const router = require('express').Router();
const isAuthenticated = require('../utilities/auth');
const User = require('../models/user');

// Index
router.get('/dashboard', (req, res) => {
    Post.find({}, (err, posts) => {
        res.render('posts/dashboard.ejs');
    });
});

// New
router.get('/posts/new', isAuthenticated, (req, res) => {
    res.render('posts/new.ejs');
});

// Delete
router.delete("/posts/:id", (req, res) => {
    Post.findByIdAndRemove(req.params.id, (err, post) => {
        res.redirect("/dashboard")
    })
})

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
router.get("/posts/:id", isAuthenticated, (req, res) => {
    const user = req.session.user
    Post.findById(req.params.id).populate('author').exec((err, foundPost) => {
        res.render("posts/show.ejs", {
            post: foundPost,
            user: req.session.user
        })

        console.log(user)
        console.log(foundPost)
    })
});

module.exports = router;

// <% if (user === post.author_id) { %>
//     <H2><a href="/posts/<%=post._id%>/edit">Edit</a></H2>
// <% } %>