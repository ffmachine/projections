const path = require('path')
const jsonfile = require('jsonfile')
const async = require('async')
const espn = require('espnff')
const _ = require('lodash')

const alias = require('../players/alias')

const dataPath = path.resolve(__dirname, './data/pff.json')
const projections = jsonfile.readFileSync(dataPath)

const analysisPath = path.resolve(__dirname, './data/analysis.json')

async.parallel({
  teams: function(next) {
    espn.roster.get(147002, next)
  },
  schedule: function(next) {
    espn.schedule.get({
      leagueId: 147002,
      seasonId: 2017
    }, next)
  }
}, function(err, results) {
  if (err)
    console.log(err)

  let my_team = results.teams[7]

  my_team = my_team.map(function(p) {
    return p.toLowerCase()
  })

  let my_team_projections = {}
  let my_team_players = {}

  Object.keys(projections).forEach(function(week) {
    my_team_projections[week] = {}
    let players = my_team_projections[week].players = []
    
    projections[week].player_projections.forEach(function(player) {
      let name = alias.get(player.player_name).toLowerCase()

      if (my_team.indexOf(name) > -1) {
	players.push(player)
	my_team_players[name] = player
      }
    })
  })

  Object.keys(my_team_players).forEach(function(name) {
    my_team_players[name].total_starts = 0
    my_team_players[name].starts = []
  })

  Object.keys(my_team_projections).forEach(function(week) {
    let players = _.orderBy(my_team_projections[week].players, 'fantasy_points', 'desc')

    let lineup = my_team_projections[week].lineup = {
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
	    my_team_players[name].total_starts += 1
	    my_team_players[name].starts.push(week)
	  }
	  break
	case 'rb':
	  if (!lineup.rb1.player_name) {
	    lineup.rb1 = player
	    lineup.total += player.fantasy_points
	    my_team_players[name].total_starts += 1
	    my_team_players[name].starts.push(week)	    
	    return
	  }

	  if (!lineup.rb2.player_name) {
	    lineup.rb2 = player
	    lineup.total += player.fantasy_points
	    my_team_players[name].total_starts += 1
	    my_team_players[name].starts.push(week)	    
	    return
	  }

	  if (!lineup.flex.player_name) {
	    lineup.flex = player
	    lineup.total += player.fantasy_points
	    my_team_players[name].total_starts += 1
	    my_team_players[name].starts.push(week)	    
	    return
	  }
	  break
	case 'wr':
	  if (!lineup.wr1.player_name) {
	    lineup.wr1 = player
	    lineup.total += player.fantasy_points
	    my_team_players[name].total_starts += 1
	    my_team_players[name].starts.push(week)	    
	    return
	  }

	  if (!lineup.wr2.player_name) {
	    lineup.wr2 = player
	    lineup.total += player.fantasy_points
	    my_team_players[name].total_starts += 1
	    my_team_players[name].starts.push(week)
	    return
	  }

	  if (!lineup.flex.player_name) {
	    lineup.flex = player
	    lineup.total += player.fantasy_points
	    my_team_players[name].total_starts += 1
	    my_team_players[name].starts.push(week)	    
	    return
	  }
	  break	  

	case 'te':
	  if (!lineup.te.player_name) {
	    lineup.te = player
	    lineup.total += player.fantasy_points
	    my_team_players[name].total_starts += 1
	    my_team_players[name].starts.push(week)	    
	    return
	  }
	  break

	case 'k':
	  if (!lineup.k.player_name) {
	    lineup.k = player
	    lineup.total += player.fantasy_points
	    my_team_players[name].total_starts += 1
	    my_team_players[name].starts.push(week)	    
	  }
	  break
      }
    })
  })

  console.log(my_team_players)

  jsonfile.writeFileSync(analysisPath, my_team_projections, {spaces: 2})
})

// show vs competition
