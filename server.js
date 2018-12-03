'use strict'

const io = require('socket.io')(8080)
const Douyu = require('./lib/Douyu')
const Audio = require('./lib/BaiduAudio')

let danmu = null
let token = ''
const APP_KEY = 'O6uM1iUqR4fqX6v7Ezy66f2Y'
const APP_SECRET = 'qyr0BSzwkxFFRCyabB6sZGkzVD3S9CcH '

io.on('connection', async (socket) => {
    // 百度语音
    const audio = new Audio(APP_KEY, APP_SECRET)
    token = await audio.getToken()
    // 获取房间号
    let roomId = parseInt(socket.handshake.query.roomId)
    // 初始化弹幕
    if (!danmu) {
        danmu = new Douyu(roomId)
        danmu.start()
        // 监听
        danmu.on('chat', (data) => {
            io.emit('chat', data, audio.getTextUrl())
        })
        danmu.on('gift', (data) => {
            io.emit('gift', data, audio.getTextUrl())
        })
        danmu.on('enter', (data) => {
            io.emit('enter', data, audio.getTextUrl())
        })
        danmu.on('rankup', (data) => {
            io.emit('rankup', data, audio.getTextUrl())
        })
        danmu.on('ban', (data) => {
            io.emit('ban', data, audio.getTextUrl())
        })
        danmu.on('badgeup', (data) => {
            io.emit('badgeup', data, audio.getTextUrl())
        })
    }
})
