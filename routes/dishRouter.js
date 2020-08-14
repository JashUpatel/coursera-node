const express = require('express');
const bodyParser = require('body-parser');


const dishRouter = express.Router();

dishRouter.use(bodyParser.json());


//router for general resourse


dishRouter.route('/')
.all((req, res, next)=>{
    res.statusCode= 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})

.get((req, res, next)=>{
    res.end('Will send all the dishes to you!');
})

.post((req, res, next)=>{
    res.end('will add the dish: '+ req.body.name + ' with details: '+ req.body.description);

})

.put((req, res, next)=>{
    res.statusCode=403;
    res.end('Put operation not supported on /dishes');

})

.delete((req, res, next)=>{
    res.end('Deleting all the dishes');

});



//router specific resource


dishRouter.route('/:dishId')
.get((req, res, next)=>{
    res.end('Will send detail of the dish to you!'+ req.params.dishId);
})

.post((req, res, next)=>{
    res.statusCode=403;
    res.end('Post operation not supported on /dishes/'+req.params.dishId);

})

.put((req, res, next)=>{
    res.write('updating the dish: '+ req.params.dishId+'\n');
    res.end('will update the dish: '+req.body.name+' with details: '+req.body.description);
})

.delete((req, res, next)=>{
    res.end('Deleting the dishes: '+req.params.dishId);

});


module.exports = dishRouter;