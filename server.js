'use strict';

const pf = require('util').promisify;
const request = require('request');
const io = require('socket.io')(8080);
const Danmu = require('./lib/Danmu');

const ROOM_ID = 1975380;

io.on('connection', (socket) => {
    /**
     * Bugs
     * 第二次连接的时候会返回两条消息，以此类推。
     */
    
    const danmu = new Danmu(ROOM_ID);
    danmu.start();
    danmu.on('chat', (data) => {
        io.emit('chat', data);
    });
    danmu.on('gift', (data) => {
        io.emit('gift', data);
    });
    danmu.on('enter', (data) => {
        io.emit('enter', data);
    });
    danmu.on('rankup', (data) => {
        io.emit('enter', data);
    });
    danmu.on('ban', (data) => {
        io.emit('ban', data);
    });
    danmu.on('badgeup', (data) => {
        io.emit('badgeup', data);
    });
});