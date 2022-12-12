const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth,(req, res) => {
    
  Promise.all ([
    
    User.findAll({
      where: {
        id: req.session.user_id
    
        },
        attributes: [
            'username',
            'email',
            'bio'
        ],
    }),

    Post.findAll({
        where: {
        user_id: req.session.user_id
        },
        attributes: [
            'id',
            'post_text',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
          {
              model: Comment,
              attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
              include: {
              model: User,
              attributes: ['username','id']
          }
          },
          {
              model: User,
              attributes: ['username', 'email', 'bio', 'id']
          }
        ]
    }) 
  ])
      .then(arrData => {
        console.log(arrData);

        let loginStatus;
          if (typeof req.session.express != 'undefined') {
            loginStatus =  req.session.express.user;
          } else {
              loginStatus = false;
          }         

        const users = arrData[0].map(user => user.get({ plain: true }));
        const posts = arrData[1].map(post => post.get({ plain: true }));
        res.render('profile', { posts, users, loggedIn: true }); 
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});
      

router.get('/:id', withAuth, (req, res) => {
  
  Promise.all ([
    
      User.findOne({
        where: {
          id: req.params.id
        },
        attributes: [
          'username',
          'email',
          'bio'
        ],
      }),

    Post.findOne({
    where: {
    id: req.params.id
    },
    attributes: ['id', 
                'post_text', 
                'created_at',
                [sequelize.literal('(SELECT COUNT(*) FROM like WHERE post.id = like.post_id)'), 'like_count']
            ],
    include: [
    {
        model: User,
        attributes: ['username', 'id']
    },
    {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
        model: User,
        attributes: ['username']
        }
    }
    ]
    }) 
  ])
    .then(arrData => {

      let loginStatus;
          if (typeof req.session != 'undefined') {
            loginStatus =  req.session.user;
          } else {
              loginStatus = false;
          }
          console.log(loginStatus);
      
      const user = arrData[0].map(user => user.get({ plain: true }));
      const post = arrData[1].map(post => post.get({ plain: true }));
      res.render('profile/id', { post, user, loggedIn: loginStatus }); 
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


module.exports = router;