const app = new Vue({
    el: '#app',
    data: {
        messageList: [],
        giftList: {},
        danmuStatus: false
    },
    methods: {
        start() {
            // 开启socket.io，并接受弹幕数据
            this.socket = io('http://localhost:8080', {'sync disconnect on unload': true });
            this.socket.on('chat', (data) => {
                let message = '';
                data.bnn && data.bl ? message += `<font color="#ff630e">[${data.bnn}Lv${data.bl}] </font>` : '';
                message += `<font color="#2b94ff">${data.nn}(Lv${data.level})</font> ：${data.txt}`;
                this.messageList.push(message);
                this.scrollToBottom();
            });
            this.socket.on('gift', (data) => {
                let message = '';
                data.bnn && data.bl ? message += `<font color="#ff630e">[${data.bnn}Lv${data.bl}]</font>` : '';
                message += `<font color="#2b94ff">${data.nn}(Lv${data.level})</font> 赠送了${data.gfcnt}个礼物`;
                this.messageList.push(message);
                this.scrollToBottom();
            });
            this.socket.on('enter', (data) => {
                // TODO 可以根据上次进入时间，判断是否回到直播间。
                let message = '';
                data.bnn && data.bl ? message += `<font color="#ff630e">[${data.bnn}Lv${data.bl}]</font>` : '';
                message += `<font color="#2b94ff">${data.nn}(Lv${data.level})</font> 欢迎进入直播间！`;
                this.messageList.push(message);
                this.scrollToBottom();
            });
            this.socket.on('rankup', (data) => {
                let message = '恭喜 ';
                data.bnn && data.bl ? message += `<font color="#ff630e">[${data.bnn}Lv${data.bl}]</font>` : '';
                message += `<font color="#2b94ff">${data.nn}(Lv${data.level})</font> 等级从${data.level-1}提升至${data.level}级！`;
                this.messageList.push(message);
                this.scrollToBottom();
            });
            // TODO 禁言, 徽章升级
        },
        stop() {
            // 停止socket.io
            this.socket.close();
        },
        scrollToBottom() {
            // 滚动到最底部
            const boxElement = this.$refs.danmu;
            boxElement.scrollTop = boxElement.scrollHeight - boxElement.clientHeight;
        },
        toggleDanmuStatus() {
            // 切换弹幕开启状态
            this.danmuStatus = !this.danmuStatus;
            if(this.danmuStatus){
                this.start();
            }else{
                this.stop();
            }
        }
    },
    mounted() {
        // 挂载完毕
    }
});