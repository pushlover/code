const bcrypt = require('bcrypt');
const e = require('express');

// used in /user/login and /user/register endpoints

async function hashPassword(password){
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (error, hash) => {
      if(error){
        reject(error)
      } else {
        resolve(hash)
      }
    })
  })
}

async function checkPassword(password, hashedPassword){
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword).then(result => {
      resolve(result)
    }).catch(error => {
      if(error){
        reject(error)
      }
    })
  })
}

module.exports = {
  hashPassword,
  checkPassword,
}