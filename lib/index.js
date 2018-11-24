const app = new Vue({
    el: '#app',
    data: {
        messageList: [],
        giftList: {}
    },
    mounted() {
        this.socket = io('http://localhost:8080', {'sync disconnect on unload': true });
        this.socket.on('chat', (data) => {
            let message = '';
            data.bnn && data.bl ? message += `<font color="#ff630e">[${data.bnn}Lv${data.bl}]</font>` : '';
            message += `<font color="#2b94ff">${data.nn}(Lv${data.level})</font>： ${data.txt}`;
            this.messageList.push(message);
        });
        this.socket.on('gift', (data) => {
            let message = '';
            data.bnn && data.bl ? message += `<font color="#ff630e">[${data.bnn}Lv${data.bl}]</font>` : '';
            console.log(this.giftList[data.gfid]);
            message += `<font color="#2b94ff">${data.nn}(Lv${data.level})</font>赠送了${data.gfcnt}个礼物`;
            this.messageList.push(message);
        });
        // TODO 用户进入房间, 等级提升, 禁言, 徽章升级
    }
});