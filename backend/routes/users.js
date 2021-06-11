var express = require('express');
var router = express.Router();
const moment = require('moment');
const hashPassword = require('../utilities/encryption').hashPassword;
const checkPassword = require('../utilities/encryption').checkPassword;
const createToken = require ('../utilities/jwt').createToken;
const formatProfileNoAuth = require('../utilities/formatters').formatProfileNoAuth;
const formatProfileWhenAuth = require('../utilities/formatters').formatProfileWhenAuth;

router.post("/register", async (req, res) => {
  if(Object.entries(req.body).length === 0 ){
    return res.status(400).json({
      "error": true,
      "message": "Request body incomplete, both email and password are required"
    })
  } else if(!req.body.email || !req.body.password){
    return res.status(400).json({
      "error": true,
      "message": "Request body incomplete, both email and password are required"
    })
  }
  await req.db.from('users').where({email:req.body.email}).then(result => {
    if(result.length > 0){
      return res.status(409).json({
        "error": true,
        "message": "User already exists"
      })
    }
  })
  await hashPassword(req.body.password).then(hash => {
    req.db.from('users').insert({
      email:req.body.email,
      password:hash
    }).then(success => {
      res.status(201).json({
        "message": "User created"
      })
    })
  })
})

router.post("/login", async (req, res) => {
  if(Object.entries(req.body).length === 0 ){
    return res.status(400).json({
      "error": true,
      "message": "Request body incomplete, both email and password are required"
    })
  } else if(!req.body.email || !req.body.password){
    return res.status(400).json({
      "error": true,
      "message": "Request body incomplete, both email and password are required"
    })
  }
  await hashPassword(req.body.password).then(hash => {
    req.db.from('users').where({email:req.body.email}).then(result => {
      if(result.length > 0){
        checkPassword(req.body.password, result[0].password).then(result => {
          if(result){
            const token = createToken(req.body.email)
            return res.status(200).json({
              "token": token,
              "token_type": "Bearer",
              "expires_in": 60 * 60 * 24
            })
          } else {
            return res.status(401).json({
              "error": true,
              "message": "Incorrect email or password"
            })
          }
        })
      } else {
        return res.status(401).json({
          "error": true,
          "message": "Incorrect email or password"
        })
      }
    })
  })
})

router.get('/:email/profile', (req, res) => {
  if(req.user){
    req.db.from('users').where({email:req.params.email}).first().then(result => {
      if(!result){
        return res.status(404).json({
          "error":true,
          "message":"User not found"
        })
      }
      if(req.user === req.params.email){
        return res.send(formatProfileWhenAuth(result))
      } else {
        res.send(formatProfileNoAuth(result))
      }
    })
  } else {
    req.db.from('users').where({email:req.params.email}).first().then(result => {
      if(!result){
        return res.status(404).json({
          "error":true,
          "message":"User not found"
        })
      }
      return res.send(formatProfileNoAuth(result))
    })
  }
})

router.put('/:email/profile', (req, res) => {
  const isNumber = /^\d+$/;
  if(!req.headers.authorization){
    return res.status(401).json({
      "error": true,
      "message": "Authorization header ('Bearer token') not found"
    })
  }
  if(req.user){
    if(req.user === req.params.email){
      if(req.body.firstName && req.body.lastName && req.body.dob && req.body.address){
        if(!isNaN(parseInt(req.body.firstName)) || !isNaN(parseInt(req.body.lastName)) || typeof req.body.address !== 'string'){
          return res.status(400).json({
            "error":true,
            "message": "Request body invalid, firstName, lastName and address must be strings only."
          })
        }
        if(!req.body.dob.match(/^\d{4}-\d{2}-\d{2}$/)){
          return res.status(400).json({
            "error":true,
            "message": "Invalid input: dob must be a real date in format YYYY-MM-DD."
          })
        }
        
        if(!moment(req.body.dob).isValid()){
          return res.status(400).json({
            "error":true,
            "message": "Invalid input: dob must be a real date in format YYYY-MM-DD."
          })
        }
        if(!moment(req.body.dob).isBefore(moment())){
          return res.status(400).json({
            "error":true,
            "message": "Invalid input: dob must be a date in the past."
          })
        }
        req.db.from("users").update({
          firstName:req.body.firstName,
          lastName:req.body.lastName,
          dob:req.body.dob,
          address:req.body.address
        }).where({email:req.params.email}).then(result => {
          req.db.from("users").where({email:req.params.email}).first().then(user => {
            res.status(200).json(formatProfileWhenAuth(user))
          })
        })
      } else {
        return res.status(400).json({
          "error": true,
          "message": "Request body incomplete: firstName, lastName, dob and address are required."
        })
      }
    } else {
      return res.status(403).json({
        "error": true,
        "message": "Forbidden"
      })
    }
  } else {
    return res.status(401).json({
      "error": true,
      "message": "Authorization header ('Bearer token') not found"
    })
  }
})

module.exports = router;
