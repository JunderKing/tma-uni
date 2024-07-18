<template>
  <view class="content">
    <view class="form-region">
      <div class="form-title">USER</div>
      <view class="form-line" v-for="(value, key) in userData" :key="key">
        <view class="label">{{key}}</view>
        <view class="value">{{value}}</view>
      </view>
    </view>
    <view class="form-region" v-if="currentWallet">
      <div class="form-title">WALLET</div>
      <div class="form-line">
        <view class="label">wallet</view>
        <view class="value">{{currentWallet.appName}}</view>
      </div>
      <div class="form-line">
        <view class="label">public key</view>
        <view class="value">{{hideStr(currentWallet.account.publicKey)}}</view>
      </div>
      <div class="form-line">
        <view class="label">address raw</view>
        <view class="value">{{hideStr(currentWallet.account.address)}}</view>
      </div>
      <div class="btn-line">
        <div class="btn btn-primary" @click="disconnect">断开连接</div>
      </div>
      <!-- <div class="form-line">
        <view class="label">address</view>
        <view class="value">{{hideStr(rawToBase64(currentWallet.account.address))}}</view>
      </div> -->
    </view>
    <view class="btn-region">
      <view class="btn btn-primary" @click="payByWallet" v-if="currentWallet">PayByWallet</view>
      <view class="btn btn-primary" @click="connect" v-else>Connect</view>
      <view class="btn btn-secondary" @click="payByStar">PayByStars</view>
    </view>
  </view>
</template>

<script>
import {TonConnectUI} from '@tonconnect/ui';
// import { WalletContractV4 } from "@ton/ton";

export default {
  data() {
    return {
      // botToken: '7017202559:AAFIdFaZQAprDnPFlbXvs0UW9STqJA5GAPU',
      botToken: '7293950505:AAExuq1OFmJsUQ2tM8gi18BArrqWjhtNBsI',
      tgApiUrl: 'https://api.telegram.org',
      // tonWallet: '0:d201e07dc8faa18148fcfcbc37699749527e82488e3e9a2ea39bb92eb6e849b0',
      tonWallet: 'UQDSAeB9yPqhgUj8_Lw3aZdJUn6CSI4-mi6jm7kutuhJsF2J',
      tonConnectUI: null,
      webApp: null,
      userData: {
        first_name: 'HELLO',
        last_name: 'WORLD'
      },
      currentWallet: null,
    }
  },
  onLoad() {
    this.webApp = window.window.Telegram.WebApp 
    console.log('initData', this.webApp.initData)
    if (this.webApp.initDataUnsafe) {
      // this.verifyInitData(this.webApp.initData)
      this.userData = this.webApp.initDataUnsafe.user
    }
  },
  onReady() {
    this.initWallet()
  },
  methods: {
    async initWallet() {
      this.tonConnectUI = new TonConnectUI({
        manifestUrl: 'https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json',
        // manifestUrl: 'https://tma.charsoft.tech/static/tonconnect-manifest.json',
      });
      this.currentWallet = this.tonConnectUI.wallet;
      console.log('wallet', this.currentWallet)
      const unsubscribe = this.tonConnectUI.onStatusChange(wallet => {
        console.log('change', wallet)
        this.currentWallet = wallet
      })
    },

    async verifyInitData(initData) {
      initData = 'query_id=AAHPRgVfAAAAAM9GBV_8fgzc&user=%7B%22id%22%3A1594181327%2C%22first_name%22%3A%22Messi%22%2C%22last_name%22%3A%22King%22%2C%22language_code%22%3A%22zh-hans%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1721223083&hash=3fa2767433f28bda4d069b45ebccad40c62067dfe87566e40f16b0df0dbe82ac'
      const result = decodeURIComponent(initData)
      console.log({result})
    },

    async connect() {
      const connectedWallet = await this.tonConnectUI.connectWallet();
      console.log('connect', connectedWallet)
    },

    async disconnect() {
      await this.tonConnectUI.disconnect()
    },

    async payByWallet() {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [{
          address: this.tonWallet,
          amount: 10000000,
        }]
      }
      const result = await this.tonConnectUI.sendTransaction(transaction)
      console.log('payByTon', {result})
    },

    async payByStar() {
      // 获取订单链接(放在服务端)
      const resp = await this.botApi('createInvoiceLink', {
        title: 'PAY_TITLE',
        description: 'PAY_DESC',
        payload: 'PAY_PAYLOAD',
        currency: 'XTR', // star支付固定值
        prices: '[{"amount":1,"label":"LABEL"}]'
      })
      if (!resp.data.ok) {
        return console.log('CreateInvoiceLinkError', resp.data)
      }
      console.log('InvoiceLink', resp.data.result)
      // 打开订单链接
      this.webApp.openInvoice(resp.data.result)
    },

    tonAddress (publicKey) {
    },

    hideStr(str) {
      return str.slice(0, 6) + '...' + str.slice(-6)
    },

    async botApi(method, data = {}) {
      return new Promise((resolve, reject) => {
        uni.request({
          url: `${this.tgApiUrl}/bot${this.botToken}/${method}`,
          data, method: 'POST',
          success: res => {
            resolve(res)
          },
          fail: err => {
            reject(err)
          }
        })
      })
    }
  },
}
</script>

<style>
.content {
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.btn-region {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #d9d9d9;
}
.btn {
  font-size: 30upx;
  height: 60upx;
  width: 200upx;
  border-radius: 10upx;
  margin: 10upx 30upx;
  text-align: center;
  line-height: 60upx;
  cursor: pointer;
  padding: 5upx 20upx;
}
.btn-primary {
  background-color: #4096ff;
  color: #FFFFFF;
}
.btn-secondary {
  border: 1px solid #d9d9d9;
}
.form-title {
  width: 100%;
  text-align: center;
  padding: 20upx;
  font-weight: 600;
}
.form-region {
  margin-bottom: 20upx;
  width: 100%;
}
.form-line {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10upx 20upx;
}
.btn-line {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
