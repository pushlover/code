// legacy funtion before understand how to use knex

function queryForRankings(query){
  let dbquery = "SELECT * from rankings"
  let yearQuery = " year = "
  let countryQuery = " country = "
  if(query.year){
    yearQuery = yearQuery.concat(`'${query.year}' `);
  } 
  if(query.country)
  {
    countryQuery = countryQuery.concat(`'${query.country}' `);
  }
  if(query.year && query.country){
    return dbquery.concat(" WHERE ", yearQuery, " and ", countryQuery)
  }
  else if(query.year && !query.country){
    return dbquery.concat(" WHERE ", yearQuery)
  }
  else if(!query.yaer && query.country){
    return dbquery.concat(" WHERE ", countryQuery)
  }
  return dbquery;
}

function queryForCountries(knex, query){
  return knex
}

module.exports = {
  queryForRankings
}