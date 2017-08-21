const Hapi = require('hapi')
const scheduler = require('./src/module/jobs')

const server = new Hapi.Server()
server.connection({ port: 10700 })

server.start((err) => {
  if (err) {
    throw err
  }
  scheduler.job1.start()
  scheduler.job2.start()

  console.log('Server running at:', server.info.uri)
})
