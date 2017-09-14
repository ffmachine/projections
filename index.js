const jsonfile = require('jsonfile')
const path = require('path')
const utils = require('./utils')

const dataPath = path.resolve(__dirname, './data/pff.json')
const projections = jsonfile.readFileSync(dataPath)

const analyze = function(team) {
  let team_projections = utils.getProjections(team, projections)

  return team_projections
}

module.exports = analyze
