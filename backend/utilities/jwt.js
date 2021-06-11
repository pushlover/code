const jwt = require('jsonwebtoken');

const secret = "I really want to pass this subject"

function createToken(email){
  return jwt.sign({email:email}, secret, {expiresIn: 60 * 60 * 24})
}

// this JWT token checker is used for /factors endpoint
function verifyToken(req, res, next){
  if(!req.headers.authorization){
    return res.status(401).json({
      "error": true,
      "message": "Authorization header ('Bearer token') not found"
    })
  }
  const authHeader = req.headers.authorization.split(" ");
  if (authHeader[0] === "Bearer"){
    jwt.verify(authHeader[1], secret, (err, decoded) => {
      if(err){
        return res.status(401).json({
          "error": true,
          "message": "Invalid JWT token"
        })
      } else {
        if(decoded.exp * 1000 > Date.now()){
          req.user = decoded.email
          return next();
        } else {
          return res.status(401).json({
            "error":true,
            "message": "JWT token has expired"
          })
        } 
      }
    })
    } else {
      return res.status(401).json({
        "error": true,
        "message": "Authorization header is malformed"
      })
    }
  } 

// this JWT token chekcer is used for /user/email/ endpoints
async function authChecker(req, res, next){
  if(!req.headers.authorization){
    return next();
  }
  const authHeader = req.headers.authorization.split(" ");
  if (authHeader[0] === "Bearer"){
  await jwt.verify(authHeader[1], secret, (err, decoded) => {
      if(err){
        return res.status(401).json({
          "error": true,
          "message": "Invalid JWT token"
        })
      } else {
        if(decoded.exp * 1000 < Date.now()){
          return res.status(401).json({
            "error": true,
            "message": "JWT token has expired"
          });
        } else {
          req.user = decoded.email
          return next();
        } 
      }
    })
    
  } else {
    return next();
  }
}

module.exports = {
  createToken,
  verifyToken,
  authChecker,
}