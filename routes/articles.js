const express = require('express');
const passport = require('passport');
const router = express.Router();

const Article = require('./../models/article');

// Google OAuth login route
router.get('/auth/google', passport.authenticate(
    'google',
    { scope: ['profile', 'email'] }
  ));

  // Google OAuth callback route
 router.get('/oauth2callback', passport.authenticate(
    'google',
    {
      successRedirect : '/user',
      failureRedirect : '/'
    }
  ));

  // OAuth logout route
 router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

router.get('/new', (req, res) => {
    res.render('articles/new', {article: new Article()});
});

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', {article: article});
});

router.get('/:id', async (req, res) => {
    const article = await Article.findById(req.params.id);
    if (article == null) res.redirect('/');
    res.render('articles/show', {article: article});
});

router.post('/', async (req, res, next) => {
    req.article = new Article();
    next();
}, saveArticle('new'));

router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
}, saveArticle('edit'));

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

function saveArticle(path) {
    return async (req, res) => {
        let article = req.article;
        article.title = req.body.title;
        article.length = req.body.length;
        article.difficulty = req.body.difficulty;
        article.distanceFromDowntown = req.body.distanceFromDowntown;
        article.description = req.body.description;
        article.review = req.body.review;
    
        try {
            article = await article.save();
            res.redirect(`/articles/${article.id}`);
        }catch (e){
            console.log(e);
            res.render(`articles/${path}`, {article: article});
        }
    };
};

module.exports = router;