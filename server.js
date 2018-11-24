'use strict';

const pf = require('util').promisify;
const request = require('request');
const io = require('socket.io')(8080);
const Danmu = require('./lib/Danmu');

const ROOM_ID = 71415;

const danmu = new Danmu(ROOM_ID);
danmu.start();

io.on('connection', (socket) => {

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