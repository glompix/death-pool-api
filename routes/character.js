var express = require('express');
var character = require('../models/character')
var router = express.Router();

router.get('/', function(req, res, next) {
  character.getAll(function (error, data) {
    if (error) {
      res.statusCode = 500;
      res.send({ error: error });
    } else {
      res.send(data);
    }
  });
});

router.post('/', function(req, res, next) {
  if (!req.authenticated) {
    res.sendStatus(401)
  } else {
    res.send("you can do itttt");
  }
});

module.exports = router;
