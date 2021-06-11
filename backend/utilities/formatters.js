//return formatted ranking array
function formatRankings(rankings){
  return rankings.map(ranking => {
    return {
      rank:ranking.rank,
      country:ranking.country,
      score:ranking.score,
      year:ranking.year
    }
  })
}

//return formatted country array
function formatCountry(lists){
  return lists.map(list => {
    return list.country
  })
}

//return formatted factors array
function formatFactors(rankings){
  return rankings.map(ranking => {
    return {
      rank:ranking.rank,
      country:ranking.country,
      score:ranking.country,
      economy:ranking.economy,
      familty:ranking.family,
      health:ranking.health,
      freedom:ranking.freedom,
      generosity:ranking.generosity,
      trust:ranking.trust
    }
  })
}

//return formatted factors array
function formatProfileNoAuth(user){
  return {
    email:user.email,
    firstName:user.firstName,
    lastName:user.lastName
  }
}


//return formatted factors array when authorised
function formatProfileWhenAuth(user){
  return {
    email:user.email,
    firstName:user.firstName,
    lastName:user.lastName,
    dob:user.dob,
    address:user.address
  }
}

module.exports = {
  formatRankings,
  formatCountry,
  formatFactors,
  formatProfileNoAuth,
  formatProfileWhenAuth,
}