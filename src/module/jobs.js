const cron = require('cron')
const moment = require('moment')
const Knex = require('../../config/db')

let job = new cron.CronJob({
  cronTime: '01 00 * * *',
  onTick: function () {
    console.log('start daily log table in_http_read')
    let myTime = moment().subtract(1, 'days').format('YYYY-MM-DD')
    let startTime = '00:00:00'
    let endTime = '23:59:59'
    let startDate = myTime + ' ' + startTime
    let endDate = myTime + ' ' + endTime

    Knex('users').select('username').then((users) => {
      for (let i = 0; i < users.length; i++) {
        // start query to count records
        Knex.raw('SELECT COUNT(in_seq) as request, COUNT(IF(in_stat= ? ,1,null)) AS failed, COUNT(IF(in_stat= ? ,1,null)) as success FROM in_http_read WHERE user_name = ? AND in_time BETWEEN ? AND ?', [7, 4, users[i].username, startDate, endDate]).then(([total]) => {
          // console.log(total)
          Knex('sms_record').returning('in_seq').insert({
            user_name: users[i].username,
            count_date: myTime,
            request: total[0].request,
            success: total[0].success,
            failed: total[0].failed
          }).then((result) => {
            console.log(result)
            return null
          }).catch((err) => {
            console.error(err)
          })
          return null
        }).catch((err) => {
          console.error(err)
        })
      }
      return null
    }).catch((err) => {
      console.error(err)
    })
  },
  start: false,
  timeZone: 'Asia/Jakarta'})

let job2 = new cron.CronJob({
  cronTime: '1 * * * *',
  onTick: function () {
    console.log('start hourly log table in_http_read')
    let myTime = moment().format('YYYY-MM-DD')
    let startTime = moment().subtract(1, 'hours').format('HH:[00:00]')
    let endTime = moment().subtract(1, 'hours').format('HH:[59:59]')
    let startDate = myTime + ' ' + startTime
    let endDate = myTime + ' ' + endTime

    Knex('users').select('username').then((users) => {
      for (let i = 0; i < users.length; i++) {
        // start query to count records
        Knex.raw('SELECT COUNT(in_seq) as request, COUNT(IF(in_stat= ? ,1,null)) AS failed, COUNT(IF(in_stat= ? ,1,null)) as success FROM in_http_read WHERE user_name = ? AND in_time BETWEEN ? AND ?', [7, 4, users[i].username, startDate, endDate]).then(([total]) => {
          // console.log(total)
          Knex('sms_record').returning('in_seq').insert({
            user_name: users[i].username,
            count_date: myTime,
            count_time: startTime,
            request: total[0].request,
            success: total[0].success,
            failed: total[0].failed
          }).then((result) => {
            console.log(result)
            return null
          }).catch((err) => {
            console.error(err)
          })
          return null
        }).catch((err) => {
          console.error(err)
        })
      }
      return null
    }).catch((err) => {
      console.error(err)
    })
  },
  start: false,
  timeZone: 'Asia/Jakarta'})

module.exports.job1 = job
module.exports.job2 = job2
