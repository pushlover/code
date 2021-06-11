var express = require('express');
var router = express.Router();
// legacy functions before understand how to use knex properly
// const rankingFormatter = require("../utilities/formatters").formatRankings;
// const rankingQuery = require('../utilities/dbqueries').queryForRankings;

router.get('/', (req, res) => {
  let pattern = "[0-9]"
  let yearPattern = /^\d{4}$/g
  if(Object.entries(req.query).length !== 0 && (!req.query.year && !req.query.country)){
    return res.status(400).json({
      error:true,
      message:`Invalid query parameters: ${Object.keys(req.query)}. Only year and country are permitted.`
    })
  }
  if(Object.entries(req.query).length > 2 ){
    let errorquery = Object.keys(req.query)
    const result = errorquery.filter(eq => eq !== "country" && eq !== "year")
    return res.status(400).json({
      error:true,
      message:`Invalid query parameters: ${result}. Only year and country are permitted.`
    })
  }
  if(req.query.country){
    if(req.query.country.match(pattern)){
      return res.status(400).json({
        error:true,
        message:"Invalid country format. Country query parameter cannot contain numbers."
      })
    }
  }
  if(req.query.year){
    if(!req.query.year.match(yearPattern)){
      return res.status(400).json({
        error:true,
        message: "Invalid year format. Format must be yyyy."
      })
    }
  }

  if(req.query.year && !req.query.country){
    req.db.from("rankings").select('rank', 'score', 'year', 'country').where({year:req.query.year}).orderBy("year", "desc").then((rows) => {
      return res.status(200).send(rows)
    })
  } else if(!req.query.year && req.query.country){
    req.db.from("rankings").select('rank', 'score', 'year', 'country').where({country:req.query.country}).orderBy("year", "desc").then((rows) => {
      return res.status(200).send(rows)
    })
  } else if (req.query.year && req.query.country){
    req.db.from("rankings").select('rank', 'score', 'year', 'country').where({year:req.query.year, country:req.query.country}).orderBy("year", "desc").then((rows) => {
      return res.status(200).send(rows)
    })
  } else {
    req.db.from("rankings").select('rank', 'score', 'year', 'country').orderBy("year", "desc").then(rankings => {
      return res.status(200).send(rankings);
    })
  }
});


module.exports = router;