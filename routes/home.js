const express = require('express');
const router = express.Router();
const Item = require('../models/item');

const homeRouter = express.Router();

homeRouter.route('/')
.get((req, res, next) => {
  Item.find()
  .then(items => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(items);
  })
  .catch(err => next(err));
})
.post((req, res) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /home');
})
.put((req, res) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /home');
})
.delete((req, res) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /home');
});

// single item // 

homeRouter.route('/:itemId')
.get((req, res, next) => {
  Item.findById(req.params.itemId)
  .then(item => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(item);
  })
  .catch(err => next(err));
})
.post((req, res) => {
  res.statusCode = 403;
  res.end(`POST operation not supported on /home/${req.params.itemId}`);
})
.put((req, res, next) => {
  Item.findByIdAndUpdate(req.params.itemId, {
    $set: req.body
  }, {new: true })
  .then(item => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(item);
  })
  .catch(err => next(err));
})
.delete((req, res) => {
  res.statusCode = 403;
  res.end(`DELETE operation not supported on /home/${req.params.itemId}`);
})

// single item + reviews //

homeRouter.route('/:itemId/reviews')
.get((req, res, next) => {
    Item.findById(req.params.itemId)
    .then(item => {
        if (item) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(item.reviews);
        } else {
            err = new Error(`Item ${req.params.itemId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Item.findById(req.params.itemId)
    .then(item => {
        if (item) {
            item.reviews.push(req.body);
            item.save()
            .then(item => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(item);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Item ${req.params.itemId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /home/${req.params.itemId}/reviews`);
})
.delete((req, res, next) => {
    Item.findById(req.params.itemId)
    .then(item => {
        if (item) {
            for (let i = (item.reviews.length-1); i >= 0; i--) {
                item.reviews.id(item.reviews[i]._id).remove();
            }
            item.save()
            .then(item => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(item);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Item ${req.params.itemId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

// single item + specific review // 

homeRouter.route('/:itemId/reviews/:reviewId')
.get((req, res, next) => {
    Item.findById(req.params.itemId)
    .then(item => {
        if (item && item.reviews.id(req.params.reviewId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(item.reviews.id(req.params.reviewId));
        } else if (!item) {
            err = new Error(`Item ${req.params.itemId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Review ${req.params.reviewId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /home/${req.params.itemId}/reviews/${req.params.reviewId}`);
})
.put((req, res, next) => {
    Item.findById(req.params.itemId)
    .then(item => {
        if (item && item.reviews.id(req.params.reviewId)) {
            if (req.body.rating) {
                item.reviews.id(req.params.reviewId).rating = req.body.rating;
            }
            if (req.body.text) {
                item.reviews.id(req.params.reviewId).text = req.body.text;
            }
            item.save()
            .then(item => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(item);
            })
            .catch(err => next(err));
        } else if (!item) {
            err = new Error(`Item ${req.params.itemId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Review ${req.params.reviewId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Item.findById(req.params.itemId)
    .then(item => {
        if (item && item.reviews.id(req.params.reviewId)) {
            item.reviews.id(req.params.reviewId).remove();
            item.save()
            .then(item => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(item);
            })
            .catch(err => next(err));
        } else if (!item) {
            err = new Error(`Item ${req.params.itemId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Review ${req.params.reviewId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});


module.exports = homeRouter;
