const app = new Vue({
    el: '#app',
    data: {
        roomId: '',
        messageList: [],
        giftList: {},
        danmuStatus: false
    },
    methods: {
        start() {
            // 判断房间号是否为空，如果为空传一个默认值
            if(!this.roomId) {
                this.roomId = '3800'
            }
            // 开启socket.io，并接受弹幕数据
            this.socket = io('http://localhost:8080', {query: `roomId=${this.roomId}`, 'sync disconnect on unload': true });
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
                if(data.hits > 1){
                    // 礼物连击
                    message += `<font color="#2b94ff">${data.nn}(Lv${data.level})</font> 连击赠送了${data.hits}个礼物！`;
                }else{
                    // 单个礼物
                    message += `<font color="#2b94ff">${data.nn}(Lv${data.level})</font> 赠送了${data.gfcnt}个礼物！`;
                }
                this.messageList.push(message);
                this.scrollToBottom();
            });
            this.socket.on('enter', (data) => {
                let message = '';
                data.bnn && data.bl ? message += `<font color="#ff630e">[${data.bnn}Lv${data.bl}]</font>` : '';
                message += `<font color="#2b94ff">${data.nn}(Lv${data.level})</font> 欢迎进入直播间！`;
                this.messageList.push(message);
                this.scrollToBottom();
            });
            this.socket.on('rankup', (data) => {
                let message = '';
                data.bnn && data.bl ? message += `<font color="#ff630e">[${data.bnn}Lv${data.bl}]</font>` : '';
                message += `<font color="#2b94ff">${data.nn}(Lv${data.level})</font> 等级从${data.level-1}提升至${data.level}级！`;
                this.messageList.push(message);
                this.scrollToBottom();
            });
            this.socket.on('ban', (data) => {
                let message = '';
                data.bnn && data.bl ? message += `<font color="#ff630e">[${data.bnn}Lv${data.bl}]</font>` : '';
                message += `<font color="#2b94ff">${data.nn}(Lv${data.level})</font> 已被房/超管禁言！`;
                this.messageList.push(message);
                this.scrollToBottom();
            });
            this.socket.on('badgeup', (data) => {
                let message = '';
                data.bnn && data.bl ? message += `<font color="#ff630e">[${data.bnn}Lv${data.bl}]</font>` : '';
                message += `<font color="#2b94ff">${data.nn}(Lv${data.level})</font> 徽章等级从${data.lbl}提升至${data.bl}级别！`;
                this.messageList.push(message);
                this.scrollToBottom();
            });
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