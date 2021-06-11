var express = require('express');
var router = express.Router();
const countryFormatter = require("../utilities/formatters").formatCountry;

router.get("/", (req, res) => {
  if(Object.entries(req.query).length !== 0){
    return res.status(400).json({
      "error": true,
      "message": "Invalid query parameters: year. Query parameters are not permitted."
    })
  }
  req.db.distinct().from("rankings").select('country').orderBy('country', 'asc').then((rows) => {
    return res.status(200).send(countryFormatter(rows))
  }).catch(err => {
    if(err){
      console.log(err)
    }
  })
})

module.exports = router;