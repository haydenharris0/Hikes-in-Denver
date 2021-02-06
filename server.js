const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const app = express();

require('dotenv').config();
require('./config/passport');

const PORT = process.env.PORT; 


const Article = require('./models/article');
const articleRouter = require('./routes/articles');

const User = require('./models/user');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/hikes', { 
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true 
});


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({createdAt: 'desc'});
    res.render('articles/home', {articles: articles});
});

app.use('/articles', articleRouter);

app.get('*', function(req, res){
  res.redirect('/');
});

app.listen(PORT);