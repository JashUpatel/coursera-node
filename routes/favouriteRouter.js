const mongoose = require('mongoose');
const Favourite = require('../models/favourite');

const express = require('express');

const authenticate = require('../authenticate');
const bodyParser = require('body-parser');
const cors = require('./cors');


const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
.get(cors.cors, authenticate.verifyUser, (req, res, next)=>{
    Favourite.find({user: req.user._id}).populate('user dishes')
    .then((favourite)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(favourite);
    },(err)=>next(err))
    .catch((err)=>{
        next(err);
    })
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{

    Favourite.find({user:req.user._id}).then((favourite)=>{
        console.log(favourite);
        if(favourite.length>0){

        if(favourite[0].dishes.length!=0){
            // for(var i= (favourite[0].dishes.length-1); i>=0;i--){
                console.log(req.body);
                // console.log(req.body[i]._id);
                console.log(favourite);
                // if(favourite[0].dishes[i]!=req.body[i]._id){
                    // favourite[0].dishes.push(req.body[i]._id);
                // }             
            // }
            for(var i=0;i<(req.body.length);i++){
            if(favourite[0].dishes.indexOf(req.body[i]._id)==-1){
                favourite[0].dishes.push(req.body[i]._id);

            }
        }

            // favourite[0].save({new:true}).then((resp)=>console.log(resp));
                    
                    // Favourite.find({user:req.user._id}).populate('user dishes')
            favourite[0].save({new:true})   
                    .then((favourite)=>{
                        Favourite.find({user:req.user._id}).populate('user dishes').then((resp)=>{
                            console.log(resp);
                            res.statusCode=200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(resp);

                        })
                    
                })
            
            
        }
    }

        else{
            if(req.body != null){
              
            Favourite.create({ user: req.user._id }).then((favourite)=>{
                for(var i= (req.body.length-1); i>=0;i--){
                    if(favourite.dishes.indexOf(req.body[i]._id)==-1){
                        favourite.dishes.push(req.body[i]._id);
                    }             
                }
            
                // favourite.dishes.push(req.body._id);
                favourite.save({new:true})
                .then((fav)=>{
                Favourite.find({user:req.user._id}).populate('user dishes')
                .then((favourite)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourite);

                })
            })
           },(err)=>next(err))
        }

        }
    },(err)=>next(err))
    .catch((err)=>{next(err);});


    
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favourite/');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourite.find({user:req.user._id}).then((favourite)=>{
        if(favourite.length != 0){
            // for(var i=(favourite[0].dishes.length-1); i>=0; i--){
                // console.log(favourite);
                // console.log(favourite[0]);
                // console.log(favourite[0].dishes[i])
                // console.log(favourite[0].dishes.indexOf(favourite[0].dishes[i]));

                // var index = favourite[0].dishes.indexOf(favourite[0].dishes[i])
                // favourite[0].dishes.splice(index,1);
                // favourite[0].dishes.indexOf(favourite[0].dishes[i]).remove({new:true});

            // }
            favourite[0].remove();
            favourite[0].save()
            // .then((favourite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end("deleted successfully!");                
            // }, (err) => next(err));

        }
        else {
            err = new Error('Favourite not found');
            err.status = 404;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
   
});


favouriteRouter.route('/:dishId')
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favourite/'+req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next)=>{
    Favourite.find({}).where('user',req.user._id)
    .then((favourite)=>{
    
        if(favourite.length!=0){
            // console.log(req.user._id)
            // console.log("123 : "+req.params.dishId);
            // console.log("124 : "+favourite[0]);
            // console.log("125 : ",favourite.dishes);


             if(favourite[0].dishes.indexOf(req.params.dishId)==-1){
                // console.log(req.params.dishId);
                // console.log(favourite.dishes);
                favourite[0].dishes.push(req.params.dishId);
                favourite[0].save({new:true})
                .then((resp)=>{

                    res.statusCode=200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);


                })

        }
        else{
            err = new Error('Already Present as favourite')
            err.status = 401
            return next(err);
        }
    }
    else{
        Favourite.create({ user: req.user._id }).then((favourite)=>{
            favourite.dishes.push(req.params.dishId);
            favourite.save({new:true}).then((resp)=>{
                res.statusCode=200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);

            })

        })

    }

    
    },(err)=>next(err))
    .catch((err)=>next(err));


})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favourite/'+req.params.dishId);
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next)=>{
    Favourite.find({user:req.user._id})
    .then((favourite)=>{
        console.log('delete: favourite: ',favourite);
        // console.log('delete: favourite[0]: ',favourite[0]);
        // console.log('delete: favourite[0].dishes: ',favourite[0].dishes);
        // console.log('delete: favourite[0].dishes:id ',favourite[0].dishes.indexOf(req.user._id));


        if(favourite.length!=0 && favourite[0].dishes.indexOf(req.params.dishId)!=-1)
        {
            let index = favourite[0].dishes.indexOf(req.params.dishId);
            favourite[0].dishes.splice(index,1);
            favourite[0].save({new:true})
            .then((favourite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourite);                
            }, (err) => next(err));
        }
        else{
            err = new Error('Favourite dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);            
        
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
});

module.exports = favouriteRouter;