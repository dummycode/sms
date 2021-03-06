var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var mysql = require('mysql')
var cors = require('cors')

var indexRouter = require('./src/http/routes/index')

var responder = require('./src/core/responder')

var database = require('./src/core/database')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  cors({
    origin: ['http://localhost', 'https://henryharr.is'],
  }),
)

app.use('/', indexRouter)

// API routes
const apiRoutes = {
  index: '',
  messages: 'messages',
  users: 'users',
  contacts: 'contacts',
  groups: 'groups',
  group_membership: 'group_membership',
  accounts: 'accounts',
}
for (const [key, route] of Object.entries(apiRoutes)) {
  app.use(`/api/${route}`, require(`./src/http/routes/api/${key}`))
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  responder.notFoundResponse(res)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  console.log(err)
  responder.ohShitResponse(res, err.message)
})

module.exports = app
