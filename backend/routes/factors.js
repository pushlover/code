var express = require('express');
var router = express.Router();
const factorsFormatter = require('../utilities/formatters').formatFactors;

router.get("/:year", (req, res) => {
  let yearPattern = /^\d{4}$/g
  let countryPattern = "[0-9]"

  let errorquery = Object.keys(req.query)
  const result = errorquery.filter(eq => eq !== "country" && eq !== "limit")
  if(result.length > 0){
    return res.status(400).json({
      error:true,
      message:`Invalid query parameters: ${result}. Only year and country are permitted.`
    })
  }

  if(!req.params.year.match(yearPattern)){
    return res.status(400).json({
      "error": true,
      "message": "Invalid year format. Format must be yyyy."
    })
  }
  if(req.query.limit){
    if(isNaN(req.query.limit)){
      return res.status(400).json({
        "error": true,
        "message": "Invalid limit query. Limit must be a positive number."
      })
    } else if(Math.sign(req.query.limit) === -1){
      return res.status(400).json({
        "error":true,
        "message": "Invalid limit query. Limit must be a positive number."
      })
    } else {
      if(parseFloat(req.query.limit) % 1 !== 0){
        return res.status(400).json({
          "error": true,
          "message": "Invalid limit query. Limit must be a positive number."
        })
      }
    }
  }
  if(req.query.country){
    if(req.query.country.match(countryPattern)){
      return res.status(400).json({
        error:true,
        message:"Invalid country format. Country query parameter cannot contain numbers."
      })
    }
  }
  if(req.query.limit && !req.query.country){
    req.db.from("rankings").select('rank', 'score', 'year', 'country', 'health', 'economy', 'family', 'freedom', 'generosity', 'trust').where({year:req.params.year}).limit(req.query.limit).orderBy("year", "desc").then((rows) => {
      return res.status(200).send(rows)
    })
  } else if(!req.query.limit && req.query.country){
    req.db.from("rankings").select('rank', 'score', 'year', 'country', 'health', 'economy', 'family', 'freedom', 'generosity', 'trust').where({year:req.params.year, country:req.query.country}).orderBy("year", "desc").then((rows) => {
      return res.status(200).send(rows)
    })
  } else if (req.query.limit && req.query.country){
    req.db.from("rankings").select('rank', 'score', 'year', 'country', 'health', 'economy', 'family', 'freedom', 'generosity', 'trust').where({year:req.params.year, country:req.query.country}).orderBy("year", "desc").limit(req.query.limit).then((rows) => {
      return res.status(200).send(rows)
    })
  } else {
    req.db.from("rankings").select('rank', 'score', 'year', 'country', 'health', 'economy', 'family', 'freedom', 'generosity', 'trust').where({year:req.params.year}).orderBy("year", "desc").then((rows) => {
      return res.status(200).send(rows)
    })
  }
})

module.exports = router;