const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');


// get all comments; GET /api/comments
router.get('/', (req,res) => {
    Comment.findAll({})
    .then(dbCommentData => {
        res.json(dbCommentData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


//get comment by ID; GET /api/comments/1
router.get('/:id', (req, res) => {
    Comment.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if (!dbCommentData) {
            res.status(404).json({ message: 'No comment found with this id' });
        return;
        }
        res.json(dbCommentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// create a comment by an authenticated user; POST /api/comments
router.post('/', withAuth, (req,res) => {
    console.log('req.body', req.body)
    console.log('req.session', req.session)
    //check session
    if (req.session){
        Comment.create({
            comment_text: req.body.comment_text,
            // user_id: req.session.user_id,
            user_id: req.session.user_id,
            post_id: parseInt(req.body.post_id)
        })
        .then(dbCommentData => {
            console.log('dbCommentData', dbCommentData)
            res.json(dbCommentData)})
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    }  
});

 
// update a comment by ID; PUT /api/comments/1
router.put('/:id',  (req, res) => {
    Comment.update({
        comment_text: req.body.comment_text
      },
      {
        where: {
          id: req.params.id
        }
    }).then(dbCommentData => {
        if (!dbCommentData) {
            res.status(404).json({ message: 'No comment found with this id' });
            return;
        }
        res.json(dbCommentData);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


// delete comment by ID; DELETE /api/comments/1
router.delete('/:id', (req,res) => {
    Comment.destroy ({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if(!dbCommentData){
            res.status(404).json({ message: 'No comment found with this id' });
            return;
        }
        res.json(dbCommentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;