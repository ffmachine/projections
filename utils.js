const _ = require('lodash')
const alias = require('../players/alias')

const getProjections = function(team, projections) {
  let results = {
    projections: {},
    players: {}
  }

  Object.keys(projections).forEach(function(week) {
    results.projections[week] = {}
    let players = results.projections[week].players = []
    
    projections[week].player_projections.forEach(function(player) {
      let name = alias.get(player.player_name).toLowerCase()

      if (team.indexOf(name) > -1) {
	players.push(player)
	results.players[name] = player
      }
    })
  })

  Object.keys(results.players).forEach(function(name) {
    results.players[name].total_starts = 0
    results.players[name].starts = []
  })

  Object.keys(results.projections).forEach(function(week) {
    let players = _.orderBy(results.projections[week].players, 'fantasy_points', 'desc')

    let lineup = results.projections[week].lineup = {
      qb: {},
      rb1: {},
      rb2: {},
      wr1: {},
      wr2: {},
      flex: {},
      te: {},
      k: {},
      total: 0
    }

    players.forEach(function(player) {
      let name = alias.get(player.player_name).toLowerCase()      
      switch(player.position) {
	case 'qb':
	  if (!lineup.qb.player_name) {
	    lineup.qb = player
	    lineup.total += player.fantasy_points
	    results.players[name].total_starts += 1
	    results.players[name].starts.push(week)
	  }
	  break
	case 'rb':
	  if (!lineup.rb1.player_name) {
	    lineup.rb1 = player
	    lineup.total += player.fantasy_points
	    results.players[name].total_starts += 1
	    results.players[name].starts.push(week)	    
	    return
	  }

	  if (!lineup.rb2.player_name) {
	    lineup.rb2 = player
	    lineup.total += player.fantasy_points
	    results.players[name].total_starts += 1
	    results.players[name].starts.push(week)	    
	    return
	  }

	  if (!lineup.flex.player_name) {
	    lineup.flex = player
	    lineup.total += player.fantasy_points
	    results.players[name].total_starts += 1
	    results.players[name].starts.push(week)	    
	    return
	  }
	  break
	case 'wr':
	  if (!lineup.wr1.player_name) {
	    lineup.wr1 = player
	    lineup.total += player.fantasy_points
	    results.players[name].total_starts += 1
	    results.players[name].starts.push(week)	    
	    return
	  }

	  if (!lineup.wr2.player_name) {
	    lineup.wr2 = player
	    lineup.total += player.fantasy_points
	    results.players[name].total_starts += 1
	    results.players[name].starts.push(week)
	    return
	  }

	  if (!lineup.flex.player_name) {
	    lineup.flex = player
	    lineup.total += player.fantasy_points
	    results.players[name].total_starts += 1
	    results.players[name].starts.push(week)	    
	    return
	  }
	  break	  

	case 'te':
	  if (!lineup.te.player_name) {
	    lineup.te = player
	    lineup.total += player.fantasy_points
	    results.players[name].total_starts += 1
	    results.players[name].starts.push(week)	    
	    return
	  }
	  break

	case 'k':
	  if (!lineup.k.player_name) {
	    lineup.k = player
	    lineup.total += player.fantasy_points
	    results.players[name].total_starts += 1
	    results.players[name].starts.push(week)	    
	  }
	  break
      }
    })
  })

  return results
}

module.exports = {
  getProjections: getProjections
}
