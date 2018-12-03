const pf = require('util').promisify
const request = require('request')

const APP_KEY = 'O6uM1iUqR4fqX6v7Ezy66f2Y'
const APP_SECRET = 'qyr0BSzwkxFFRCyabB6sZGkzVD3S9CcH '

class BaiduAudio {
    constructor(appKey, appSecret) {
        this.appKey = appKey
        this.appSecret = appSecret
        this.token = '24.8f13e402594a8aecd70539e013ff9388.2592000.1546443537.282335-14934217'
    }

    async getToken() {
        const url = `https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=${this.appKey}&client_secret=${this.appSecret}`
        const token = await pf(request.get)(url)
        this.token = JSON.parse(token.body).access_token
        return token
    }

    async makeVoice(text) {
        if (this.token) {
            return `http://tsn.baidu.com/text2audio?lan=zh&ctp=1&cuid=99999&tok=${this.token}&tex=${text}&vol=9&per=0&spd=5&pit=5&aue=3`
        } else {
            const token = await this.getToken()
            return `http://tsn.baidu.com/text2audio?lan=zh&ctp=1&cuid=99999&tok=${token}&tex=${text}&vol=9&per=0&spd=5&pit=5&aue=3`
        }
    }

    getTextUrl() {
        return `http://tsn.baidu.com/text2audio?lan=zh&ctp=1&cuid=99999&tok=${this.token}&tex=audiotext&vol=9&per=0&spd=5&pit=5&aue=3`
    }
}

module.exports = BaiduAudio
