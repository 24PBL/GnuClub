const express = require('express');
const router = express.Router();

const db = require('../models/db');

router.get("/user/data/read", function(req, res) {
    db.users.findAll().then(function(result) {
        res.send({success:200, data:result});
    })
})

router.get("/tempuser/data/read", function(req, res) {
    db.tempUsers.findAll().then(function(result) {
        res.send({success:200, data:result});
    })
})

module.exports = router;