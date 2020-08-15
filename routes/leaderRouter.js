const express = require('express');
const bodyParser = require('body-parser');
const Leaders = require('../models/leaders');

const leaderRouter =  express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
// .all((req, res, next)=>{
//     res.statusCode= 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })

.get((req, res, next)=>{
    // res.end('Will send all the leaders to you!');
    Leaders.find({})
    .then((leaders)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders)
    },(err)=>{
        next(err)
    })
    .catch((err)=>{
        next(err);
    })

})

.post((req, res, next)=>{
    // res.end('will add the leader: '+ req.body.name + ' with details: '+ req.body.description);
    Leaders.create(req.body)
    .then((leader)=>{
        console.log('leader created',leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);

    },(err)=>next(err))
    .catch((err)=>next(err));
})

.put((req, res, next)=>{
    res.statusCode=403;
    res.end('Put operation not supported on /leaders');

})

.delete((req, res, next)=>{
    // res.end('Deleting all the leaders');
    Leaders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    

});

leaderRouter.route('/:leaderId')
.get((req, res, next)=>{
    // res.end('Will send detail of the leader to you!'+ req.params.leaderId);
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));


})

.post((req, res, next)=>{
    res.statusCode=403;
    res.end('Post operation not supported on /leaders/'+req.params.leaderId);

})

.put((req, res, next)=>{
    // res.write('updating the leader: '+ req.params.leaderId+'\n');
    // res.end('will update the leader: '+req.body.name+' with details: '+req.body.description);
  
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, { new: true })
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));

})

.delete((req, res, next)=>{
    // res.end('Deleting the promotion: '+req.params.leaderId);
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));

});

module.exports = leaderRouter;