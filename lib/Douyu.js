const net = require('net')
const events = require('events')

class Douyu {
    constructor(roomId = 3800) {
        this.serverHost = 'openbarrage.douyutv.com'
        this.serverPort = 8601
        this.roomId = roomId
        this.socket = null
        this.emitter = new events.EventEmitter()
    }

    start() {
        this.socket = net.connect(
            this.serverPort,
            this.serverHost,
            () => {
                this.login()
                this.joinGroup()
                this.listen()
                this.keepalive()
            }
        )
    }

    login() {
        if (!this.socket) return
        this.send(`type@=loginreq/roomid@=${this.roomId}/`)
    }

    joinGroup() {
        if (!this.socket) return
        this.send(`type@=joingroup/rid@=${this.roomId}/gid@=-9999/`)
        console.log('[Douyu]弹幕服务器连接成功!')
    }

    listen() {
        console.log('[Douyu]开始监听弹幕消息!')
        this.socket.on('data', (data) => {
            /**
             * chatmsg: Danmu
             * dgb: Gift
             * uenter: User Enter
             * ssd: Super Danmu
             * upgrade: User Upgrade
             * newblackres: No Talk
             * blab: Badge Upgrade
             */
            const types = {
                chatmsg: 'chat',
                dgb: 'gift',
                uenter: 'enter',
                ssd: 'superchat',
                upgrade: 'rankup',
                newblackres: 'ban',
                blab: 'badgeup'
            }
            let parsedData = this.parse(data.toString())
            if (parsedData) {
                this.emitter.emit(types[parsedData.body.type], parsedData.body)
            }
        })
    }

    on(event, callback) {
        this.emitter.on(event, callback)
    }

    keepalive() {
        if (!this.socket) return
        setInterval(() => {
            this.send('type@=mrkl/')
        }, 40 * 1000)
    }

    send(payload) {
        if (!this.socket) return
        let data = new Buffer(4 + 4 + 4 + payload.length + 1)
        data.writeInt32LE(4 + 4 + payload.length + 1, 0) //length
        data.writeInt32LE(4 + 4 + payload.length + 1, 4) //code
        data.writeInt32LE(0x000002b1, 8) //magic
        data.write(payload, 12) //payload
        data.writeInt8(0, 4 + 4 + 4 + payload.length) //end of string
        this.socket.write(data)
    }

    parse(response) {
        var typeIndex = response.indexOf('type@=')
        if (typeIndex < 0) return null
        response = response.slice(typeIndex)
        var responseArray = response.split('/')
        var responseObject = {}
        responseArray.forEach(function(message) {
            if (!message) return
            var msgArr = message.split('@=')
            var key = String(msgArr[0]).trim()
            var value = msgArr[1]
            if (key.length === 0) return
            responseObject[key] = (value || '')
                .replace(/@S/g, '/')
                .replace(/@A/g, '@')
        })
        if (!responseObject.type) return null
        return {
            raw: response,
            body: responseObject
        }
    }
}

module.exports = Douyu
