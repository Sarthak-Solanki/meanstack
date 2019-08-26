const express  = require("express");
const router = express.Router();
const Post = require('../models/post');
const multer = require("multer");
const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpg',
    'image/jpg':'jpg',

}
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        const  isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type') ;
        if(isValid){
            error = null;
        }
        cb(error,"backend/images");
    },
    filename:(req,file,cb)=>{
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null,name+'-'+Date.now()+'.'+ext);
    }

});


router.post('',multer({storage:storage}).single("image"), (req, res, next) => {
    const url = req.protocol+'://'+req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath:url+'/images/'+req.file.filename
    })
    post.save().then(result => {
      res.status(201).json({
        message: 'post added sucessfully',
        postId: {
            ...result,
            id:result._id,
        }
      })
    })
    console.log()
  });
  router.put("/:id",(req,res,next)=>{
    const post =  new Post({
        _id :req.body.id,
       title:req.body.title,
       content:req.body.content,
    });
    Post.updateOne({_id: req.params.id},post).then(()=>{
  res.status(200).json({message:"update successfull"})
    })
  });
  
  
  
  router.get('', (req, res, next) => {
    Post.find().then(documents => {
      res.status(200).json({
        message: 'post fetched succefully',
        // pass: "m27VAJQW56r8pFSd",
        posts: documents
      })
    })
  });
  
  router.get('/:id',(req,res,next)=>{
  Post.findById(req.params.id).then(post=>{
    if(post){
      res.status(200).json(post);
    }
    else{
      res.status(400).json({message:"no post found"})
    }
  })
  });
  
  router.delete('/:id', (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
      console.log(result)
      res.status(200).json({ message: 'post deleted' })
    })
  });
module.exports = router;
  