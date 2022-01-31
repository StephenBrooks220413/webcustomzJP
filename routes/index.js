var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect');
const mongoose = require('mongoose');
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const BlogPost = require('../models/BlogPost');

require('dotenv').config()

router.use(morgan());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));
router.use(fileUpload());

mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true
})

if(!mongoose){
    console.log('No DB connected')
} else {
    console.log('DB Connected')
}

router.get('/', async function (req, res, next) {
  const blogpost = await BlogPost.find({}).limit(20).sort({_id: -1})
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    blogpost,
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.get('/about', (req, res)=>{
  res.render('about')
})

router.get('/catalog', (req, res)=>{
  res.render('catalog')
})

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  });
});

////////////////////////////////////////////////////
// Blogs
router.get('/posts/new', (req, res)=>{
  res.render('create')
})

router.post('/posts/store', async (req, res)=>{
  await BlogPost.create(req.body)
  res.redirect('/')
})

router.get('/blogs', async (req, res)=>{
  const blogposts = await BlogPost.find({}).limit(20).sort({_id: -1})
  res.render('blogs', {
    blogposts
  })
})

router.get('/post/:id', async (req, res)=>{
  const blogpost = await BlogPost.findById(req.params.id)
  res.render('post',{
    blogpost
  })
})

module.exports = router;
