'use strict';

const p = require('util').promisify;
const net = require('net');
const io = require('socket.io');
const request = require('request');

class Danmu {
    constructor(roomId = 3800) {
        this.serverHost = 'openbarrage.douyutv.com';
        this.serverPort = 8601;
        this.roomId = roomId;
        this.socket = null;
        this.init();
    }

    init() {
        this.socket = net.connect(
            this.serverPort,
            this.serverHost,
            () => {
                this.login();
                this.joinGroup();
            }
        );
    }

    login() {
        if (!this.socket) return;
        this.send(`type@=loginreq/roomid@=${this.roomId}/`);
    }

    joinGroup() {
        if (!this.socket) return;
        this.send(`type@=joingroup/rid@=${this.roomId}/gid@=-9999/`);
    }

    listen() {
        this.socket.on('data', (data) => {
            let parsedData = this.parse(data.toString());
            let text = this.prettyText(parsedData);
            console.log(text);
        });
    }

    keepalive() {
        if (!this.socket) return;
        setInterval(() => {
            this.send('type@=mrkl/');
        }, 40 * 1000);
    }

    send(payload) {
        if (!this.socket) return;
        let data = new Buffer(4 + 4 + 4 + payload.length + 1);
        data.writeInt32LE(4 + 4 + payload.length + 1, 0); //length
        data.writeInt32LE(4 + 4 + payload.length + 1, 4); //code
        data.writeInt32LE(0x000002b1, 8); //magic
        data.write(payload, 12); //payload
        data.writeInt8(0, 4 + 4 + 4 + payload.length); //end of string
        this.socket.write(data);
    }

    parse(response) {
        var typeIndex = response.indexOf('type@=');
        if (typeIndex < 0) return null;
        response = response.slice(typeIndex);
        var responseArray = response.split('/');
        var responseObject = {};
        responseArray.forEach(function(message) {
            if (!message) return;
            var msgArr = message.split('@=');
            var key = String(msgArr[0]).trim();
            var value = msgArr[1];
            if (key.length === 0) return;
            responseObject[key] = (value || '')
                .replace(/@S/g, '/')
                .replace(/@A/g, '@');
        });
        if (!responseObject.type) return null;
        return {
            raw: response,
            body: responseObject
        };
    }

    prettyText(parsedData) {
        /**
         * chatmsg: Danmu
         * dgb: Gift
         * uenter: User Enter
         * ssd: Super Danmu
         * upgrade: User Upgrade
         * newblackres: No Talk
         * blab: Badge Upgrade
         */
        let body = parsedData.body;
        switch (body.type) {
            case 'chatmsg':
                return `[${body.bnn}-${body.bl}](${body.level})${body.nn}: ${
                    body.txt
                }`;
            case 'dgb':
                return `Gift: ${body.nn}`;
            case 'uenter':
                return `UserEnter: ${body.nn}`;
            case 'ssd':
                return `SuperDM: ${body.nn}`;
            case 'upgrade':
                return `UserUpgrade: ${body.nn}`;
            case 'newblackres':
                return `NoTalk: ${body.nn}`;
            case 'blab':
                return `BadgeUpgrade: ${body.nn}`;
            default:
                return '';
        }
    }
}

const danmu = new Danmu(122402);
danmu.listen();
danmu.keepalive();
