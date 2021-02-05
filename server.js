const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const PORT = 3000;
const app = express();

require('dotenv').config();
require('./config/passport');


const Article = require('./models/article');
const articleRouter = require('./routes/articles');

mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost/hikes', { 
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true 
});


app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

app.use(session({
  secret: 'SEIRFLEXRocks!',
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

app.listen(PORT);