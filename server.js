'use strict';

const io = require('socket.io')(8080);
const Danmu = require('./Danmu');

io.on('connection', (socket) => {
    console.log('connected');
    const danmu = new Danmu(122402);
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
});
