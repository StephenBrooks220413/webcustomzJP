const express = require('express');
const http = require('http');
const { requiresAuth } = require('express-openid-connect');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const { auth } = require('express-openid-connect');
const app = express();
const morgan = require('morgan')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const BlogPost = require('./models/BlogPost');

require('dotenv').config()

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());
app.use(morgan());

mongoose.connect(process.env.DB_URL,{
  useNewUrlParser: true
})

if(!mongoose){
  console.log('No DB connected')
} else {
  console.log('DB Connected')
}

const config = {
  authRequired: false,
  auth0Logout: true
};

const port = process.env.PORT || 4040;
if (!config.baseURL && !process.env.BASE_URL && process.env.PORT && process.env.NODE_ENV !== 'production') {
  config.baseURL = `http://localhost:${port}`;
}

app.use(auth(config));

// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  next();
});

app.get('/', async function (req, res, next) {
  const blogpost = await BlogPost.find({}).limit(1).sort({_id: -1})
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    blogpost,
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

app.get('/about', (req, res)=>{
  res.render('about')
})

app.get('/catalog', (req, res)=>{
  res.render('catalog')
})

app.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  });
});

////////////////////////////////////////////////////
// Blogs
app.get('/posts/new', (req, res)=>{
  res.render('create')
})

app.post('/posts/store', async (req, res)=>{
  await BlogPost.create(req.body)
  res.redirect('/')
})

app.get('/blogs', async (req, res)=>{
  const blogposts = await BlogPost.find({}).limit(20).sort({_id: -1})
  res.render('blogs', {
    blogposts
  })
})

app.get('/post/:id', async (req, res)=>{
  const blogpost = await BlogPost.findById(req.params.id)
  res.render('post',{
    blogpost
  })
})

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: process.env.NODE_ENV !== 'production' ? err : {}
  });
});

http.createServer(app)
  .listen(port, () => {
    console.log(`Listening on ${config.baseURL}`);
  });
