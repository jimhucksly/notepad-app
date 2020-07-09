'use strict'

const chalk = require('chalk')
const electron = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackHotMiddleware = require('webpack-hot-middleware')

const mainConfig = require('./webpack.main.config')
const rendererConfig = require('./webpack.renderer.config')

const express = require('express')
const server = express()

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 9080

server.set('port', port)

let electronProcess = null
let manualRestart = false
let hotMiddleware

let isRunning = false

function logStats (proc, data) {
  let log = ''

  log += chalk.yellow.bold(`${proc} Process ${new Array((19 - proc.length) + 1).join('-')}`)
  log += '\n\n'

  let p = '\n'
  p += chalk.yellow.bold(`${proc} Process ${new Array((19 - proc.length) + 1).join('-')}`)
  p += '\n'

  if (typeof data === 'object') {
    data.toString({
      colors: true,
      chunks: false
    }).split(/\r?\n/).forEach(line => {
      log += '  ' + line + '\n'
    })
  } else {
    log += `  ${data}\n`
  }

  log += '\n' + chalk.yellow.bold(`${new Array(28 + 1).join('-')}`) + '\n'

  if(
    process.env.CHUNKS_LOG === 'true' ||
    process.env.NODE_ENV === 'production'
  ) {
    console.log(log)
  } else console.log(p)
}

function startMain () {
  return new Promise((resolve, reject) => {
    mainConfig.entry.main = [
      path.join(__dirname, '../src/index.dev.js')
    ].concat(mainConfig.entry.main)

    mainConfig.mode = 'development'

    const compiler = webpack(mainConfig)

    compiler.hooks.watchRun.tapAsync('watch-run', (compilation, done) => {
      console.log(chalk.white.bold('compiling...' + '\n'))
      hotMiddleware.publish({ action: 'compiling' })
      done()
    })

    compiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err)
        return
      }

      if(!isRunning) {
        logStats('Main', stats)
      }

      if (electronProcess && electronProcess.kill) {
        manualRestart = true
        process.kill(electronProcess.pid)
        electronProcess = null
        startElectron()

        setTimeout(() => {
          manualRestart = false
        }, 5000)
      }

      resolve()
    })
  })
}

function startRenderer () {
  return new Promise((resolve, reject) => {
    rendererConfig.entry.renderer = [
      path.join(__dirname, 'dev-client')
    ].concat(rendererConfig.entry.renderer)
    rendererConfig.mode = 'development'
    const compiler = webpack(rendererConfig)

    hotMiddleware = webpackHotMiddleware(compiler, {
      log: false,
      heartbeat: 2500
    })

    compiler.hooks.compilation.tap('compilation', compilation => {
      compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync('html-webpack-plugin-after-emit', (data, cb) => {
        hotMiddleware.publish({ action: 'reload' })
        cb()
      })
    })

    compiler.hooks.done.tap('done', stats => {
      if(!isRunning) {
        logStats('Renderer', stats)
      } else {
        const d = new Date(Date.now())
        const hh = ('0' + d.getHours()).slice(-2)
        const mm = ('0' + d.getMinutes()).slice(-2)
        const ss = ('0' + d.getSeconds()).slice(-2)
        const dd = hh + ':' + mm + ':' + ss
        console.log(chalk.yellow.bold('app is updated: ') + dd + '\n')
      }
    })

    const server = new WebpackDevServer(
      compiler,
      {
        contentBase: path.join(__dirname, '../'),
        quiet: true,
        openPage: '',
        before (app, ctx) {
          app.use(hotMiddleware)
          ctx.middleware.waitUntilValid(() => {
            resolve()
          })
        }
      }
    )

    server.listen(9080)
  })
}

function startElectron () {
  var args = [
    // '--inspect=5858',
    path.join(__dirname, '../dist/electron/main.js')
  ]

  // detect yarn or npm and process commandline args accordingly
  if (process.env.npm_execpath.endsWith('yarn.js')) {
    args = args.concat(process.argv.slice(3))
  } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
    args = args.concat(process.argv.slice(2))
  }

  electronProcess = spawn(electron, args)

  electronProcess.stdout.on('data', data => {
    electronLog(data, 'blue')
  })
  electronProcess.stderr.on('data', data => {
    electronLog(data, 'red')
  })

  electronProcess.on('close', () => {
    if (!manualRestart) process.exit()
  })
}

function electronLog (data, color) {
  let log = ''
  data = data.toString().split(/\r?\n/)
  data.forEach(line => {
    log += `  ${line}\n`
  })
  if (/[0-9A-z]+/.test(log)) {
    console.log(
      chalk[color].bold('Electron -------------------') +
      '\n\n' +
      log +
      chalk[color].bold('----------------------------') +
      '\n'
    )
  }
}

function init () {
  process.env.CHUNKS_LOG = 'true'
  console.log('\n' + chalk.white('initializing app...') + '\n')

  Promise
    .all([startRenderer(), startMain()])
    .then(() => {
      isRunning = true
      console.log(chalk.green('app is sucessfully running') + '\n')
      process.env.CHUNKS_LOG = 'false'
      startElectron()
    })
    .catch(err => {
      console.error(err)
    })
}

init()
