const app = new Vue({
    el: '#app',
    data: {
        roomId: '122402',
        messageList: [],
        giftList: {},
        danmuStatus: false
    },
    methods: {
        getRank(bnn, bl) {
            if(bnn && bl) {
                return `<font color="#ff630e">[${bnn}Lv${bl}] </font>`
            }else {
                return ''
            }
        },
        getMessage(nn, level, txt) {
            return `<font color="#2b94ff">${nn}(Lv${level})</font> ：${txt}`
        },
        getGift(nn, level, hits) {
            if(hits > 1){
                // 礼物连击
                return `<font color="#2b94ff">${nn}(Lv${level})</font> 连击赠送了${hits}个礼物！`;
            }else{
                // 单个礼物
                return `<font color="#2b94ff">${nn}(Lv${level})</font> 赠送了1个礼物！`;
            }
        },
        getEnter(nn, level) {
            return `<font color="#2b94ff">${nn}(Lv${level})</font> 欢迎进入直播间！`;
        },
        getRankup(nn, level) {
            return `<font color="#2b94ff">${nn}(Lv${level})</font> 等级从${level-1}提升至${level}级！`;
        },
        getBan(nn, level) {
            return `<font color="#2b94ff">${nn}(Lv${level})</font> 已被房/超管禁言！`;
        },
        getBadgeup(nn, level, lbl, bl) {
            return `<font color="#2b94ff">${nn}(Lv${level})</font> 徽章等级从${lbl}提升至${bl}级别！`;
        },
        readText(url, text) {
            url = url.replace('audiotext', encodeURI(text))
            console.log(url)
            new Audio(url).play()
        },
        start() {
            // 判断房间号是否为空，如果为空传一个默认值
            if(!this.roomId) {
                this.roomId = '3800'
            }
            // 开启socket.io，并接受弹幕数据
            this.socket = io('http://localhost:8080', {query: `roomId=${this.roomId}`, 'sync disconnect on unload': true });
            this.socket.on('chat', (data, url) => {
                let message = '';
                message += this.getRank(data.bnn, data.bl);
                message += this.getMessage(data.nn, data.level, data.txt);
                this.messageList.push(message);
                this.readText(url, `${data.nn}说：${data.txt}`);
                this.scrollToBottom();
            });
            this.socket.on('gift', (data, url) => {
                let message = '';
                message += this.getRank(data.bnn, data.bl);
                message += this.getGift(data.nn, data.level, data.hits);
                this.messageList.push(message);
                this.readText(url, `${data.nn}赠送了一个礼物`);
                this.scrollToBottom();
            });
            this.socket.on('enter', (data, url) => {
                let message = '';
                message += this.getRank(data.bnn, data.bl);
                message += this.getEnter(data.nn, data.level);
                this.messageList.push(message);
                this.readText(url, `欢迎${data.nn}进入直播间`);
                this.scrollToBottom();
            });
            this.socket.on('rankup', (data, url) => {
                let message = '';
                message += this.getRank(data.bnn, data.bl);
                message += this.getRankup(data.nn, data.level);
                this.messageList.push(message);
                this.scrollToBottom();
            });
            this.socket.on('ban', (data, url) => {
                let message = '';
                message += this.getRank(data.bnn, data.bl);
                message += this.getBan(data.nn, data.level);
                this.messageList.push(message);
                this.scrollToBottom();
            });
            this.socket.on('badgeup', (data, url) => {
                let message = '';
                message += this.getRank(data.bnn, data.bl);
                message += this.getBadgeup(data.nn, data.level, data.lbl, data.bl);
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