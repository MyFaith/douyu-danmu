'use strict';

const pf = require('util').promisify;
const request = require('request');
const io = require('socket.io')(8080);
const Danmu = require('./lib/Danmu');

let danmu = null;

io.on('connection', (socket) => {
    // 获取房间号
    let roomId = parseInt(socket.handshake.query.roomId);
    // 初始化弹幕
    if(!danmu){
        danmu = new Danmu(roomId);
        danmu.start();
        // 监听
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
            io.emit('rankup', data);
        });
        danmu.on('ban', (data) => {
            io.emit('ban', data);
        });
        danmu.on('badgeup', (data) => {
            io.emit('badgeup', data);
        });
    }
});