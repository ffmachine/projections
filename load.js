const request = require('request')
const moment = require('moment')
const async = require('async')
const path = require('path')
var jsonfile = require('jsonfile')

var FileCookieStore = require('tough-cookie-filestore')
const cookiePath = path.resolve(__dirname, './cookies.json')

var jar = request.jar(new FileCookieStore(cookiePath));
const req = request.defaults({
  jar: jar,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'
  }
})

let week_one = moment('08-29-17')
let current_week = moment().diff(week_one, 'weeks')
const final_week = 13

const dataPath = path.resolve(__dirname, 'data/pff.json')

let projections = {}

async.whilst(
  function() { return current_week <= final_week },
  function(next) {
    const url = `https://www.profootballfocus.com/api/prankster/projections?scoring=41392&weeks=${current_week}`
    req({
      url: url,
      json: true
    }, function(err, res, data) {
      if (err)
	return next(err)

      projections[current_week] = data
      current_week += 1

      next()
    })
  },
  function (err, n) {
    if (err)
      console.log(err)

    jsonfile.writeFileSync(dataPath, projections, {spaces: 2})
  }
)
