const express = require('express');
const bodyParser = require('body-parser');
const Promotions = require('../models/promotions');
var authenticate = require('../authenticate');
var cors = require('./cors')
const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
// .all((req, res, next)=>{
//     res.statusCode= 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })

.get(cors.cors, (req, res, next)=>{
    // res.end('Will send all the promotions to you!');
    Promotions.find({})
    .then((promotions)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotions);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    // res.end('will add the promotion: '+ req.body.name + ' with details: '+ req.body.description);

    Promotions.create(req.body)
    .then((promotion)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },(err)=>next(err))
    .catch((err)=>next(err));


})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    res.statusCode=403;
    res.end('Put operation not supported on /promotions');

})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    // res.end('Deleting all the promotions');

    Promotions.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));

});

promoRouter.route('/:promoId')
.get(cors.cors, (req, res, next)=>{
    // res.end('Will send detail of the promotion to you!'+ req.params.promoId);

    Promotions.findById(req.params.promoId)
    .then((promotion)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    res.statusCode=403;
    res.end('Post operation not supported on /promotions/'+req.params.promoId);

})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    // res.write('updating the promotion: '+ req.params.promoId+'\n');
    // res.end('will update the promotion: '+req.body.name+' with details: '+req.body.description);

    Promotions.findByIdAndUpdate(req.params.promoId,{$set:req.body},{new:true})
    .then((promotion)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);


    },(err)=>next(err))
    .catch((err)=>next(err));

})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next)=>{
    // res.end('Deleting the promotion: '+req.params.promoId);

    Promotions.findByIdAndRemove(req.params.promoId)
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp)
    },(err)=>next(err))
    .catch((err)=>next(err));


});


module.exports = promoRouter;