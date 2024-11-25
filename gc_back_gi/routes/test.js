const express = require('express');
const router = express.Router();

const db = require('../models/db');

router.get("/user/data/read", function(req, res) {
    db.user.findAll().then(function(result) {
        res.send({success:200, data:result});
    })
})

router.get("/club/data/read", function(req, res) {
    db.clan.findAll().then(function(result) {
        res.send({success:200, data:result});
    })
})

router.get("/user-in-clan/data/read", function(req, res) {
    db.userInClan.findAll().then(function(result) {
        res.send({success:200, data:result});
    })
})

router.get("/tempuser/data/read", function(req, res) {
    db.tempUser.findAll().then(function(result) {
        res.send({success:200, data:result});
    })
})

router.get("/resume/data/read", function(req, res) {
    db.resume.findAll().then(function(result) {
        res.send({success:200, data:result});
    })
})

router.get("/postimg/data/read", function(req, res) {
    db.postImg.findAll().then(function(result) {
        res.send({success:200, data:result});
    })
})

router.get("/post/data/read", function(req, res) {
    db.post.findAll().then(function(result) {
        res.send({success:200, data:result});
    })
})

module.exports = router;