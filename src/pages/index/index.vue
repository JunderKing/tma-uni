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
      <div class="form-line" v-if="currentWallet">
        <view class="label">address</view>
        <view class="value">{{hideStr(userAddr)}}</view>
      </div>
      <div class="btn-line">
        <div class="btn btn-primary" @click="disconnect">断开连接</div>
      </div>
    </view>
    <view class="btn-region">
      <view class="btn btn-primary" @click="payByJetton" v-if="currentWallet">PayByUsdt</view>
      <view class="btn btn-primary" @click="payByTon" v-if="currentWallet">PayByTon</view>
      <view class="btn btn-primary" @click="connect" v-else>Connect</view>
      <view class="btn btn-secondary" @click="handleShare">Share</view>
    </view>
  </view>
</template>

<script>
import {TonConnectUI} from '@tonconnect/ui';
import { beginCell, toNano, address } from '@ton/ton'
import TonWeb from "tonweb";

export default {
  data() {
    return {
      botToken: '7293950505:AAExuq1OFmJsUQ2tM8gi18BArrqWjhtNBsI',
      tgApiUrl: 'https://api.telegram.org',
      dstAddr: 'UQAbm7uh59HHUlslW9PCru_ncNc6qAHi_7WmukvGiqk6HMTS',
      usdtAddr: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs',
      usdtDecimal: 6,
      tonConnectUI: null,
      webApp: null,
      userData: {
        first_name: 'HELLO',
        last_name: 'WORLD'
      },
      currentWallet: null,
      userAddr: ''
    }
  },
  onLoad(query) {
    console.log('startapp', query.tgWebAppStartParam)
    this.webApp = window.Telegram.WebApp 
    console.log('initData', this.webApp.initData)
    if (this.webApp.initDataUnsafe) {
      this.userData = this.webApp.initDataUnsafe.user
    }
  },
  onReady() {
    this.initWallet()
  },
  methods: {
    async handleShare() {
      const content = "Join the fun at Telegram and win big prizes! Go play and receive exclusive bonuses. Don't miss out!"
      const shareLink = 'https://t.me/KingV5Bot/TrueGame1?startapp=Telegram0000001195'
      const tgShareUrl = 'https://t.me/share/url?url={link}&text={text}'
      const url = tgShareUrl.replace('{text}', content).replace('{link}', shareLink)
      window.open(url, "_blank")
    },

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
        this.userAddr = address(wallet.account.address).toString({urlSafe: true, bounceable: false, testOnly: false})
      })
    },

    async connect() {
      const connectedWallet = await this.tonConnectUI.connectWallet();
      console.log('connect', connectedWallet)
    },

    async disconnect() {
      await this.tonConnectUI.disconnect()
    },

    async getJettonWallet(addr, jettonAddr) {
      const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'))
      const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, { address: jettonAddr });
      // console.log(new TonWeb.utils.Address(addr).toString(true, true, true))
      const fromJettonWalletAddr = await jettonMinter.getJettonWalletAddress(new TonWeb.utils.Address(addr));
      const fromJettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, { address: fromJettonWalletAddr });
      return fromJettonWallet
      // return fromJettonWalletAddr.toString(true, true, true)
    },

    async payByJetton() {
      const fromAddr = this.currentWallet.account.address
      const fromJettonWallet = await this.getJettonWallet(fromAddr, this.usdtAddr)
      const fromJettonAddr = (await fromJettonWallet.getAddress()).toString()
      console.log({fromJettonAddr})
      // console.log({fromAddr, fromJettonAddr})
      // console.log(address(fromAddr).toString())
      const jettonAmount = 0.01 * Math.pow(10, this.usdtDecimal) // 0.01 USDT
      // const jettonFeeAmount = 0.01 * Math.pow(10, 9)
      // const body = beginCell()
      //   .storeUint(0xf8a7ea5, 32)                 // jetton 转账操作码
      //   .storeUint(0, 64)                         // query_id:uint64
      //   .storeCoins(jettonAmount)                 // amount:转账的 Jetton 金额（小数位 = 6 - jUSDT, 9 - 默认）
      //   .storeAddress(address(this.dstAddr))      // destination:MsgAddress
      //   .storeAddress(address(fromAddr))          // response_destination:MsgAddress
      //   .storeUint(0, 1)                          // custom_payload:(Maybe ^Cell)
      //   .storeCoins(jettonFeeAmount)              // forward_ton_amount:(VarUInteger 16)
      //   .storeUint(0, 1)                          // forward_payload:(Either Cell ^Cell)
      //   .endCell();
      const comment = new Uint8Array([... new Uint8Array(4), ... new TextEncoder().encode('HELLO')]);
      const payload = await fromJettonWallet.createTransferBody({
        jettonAmount: jettonAmount, // Jetton数量（以最基本的不可分割单位计）
        toAddress: new TonWeb.utils.Address(this.dstAddr), // 接收用户的钱包地址（非Jetton钱包）
        forwardAmount: TonWeb.utils.toNano('0.01'), // 用于触发Transfer notification消息的一些TON数量
        forwardPayload: comment, // Transfer notification消息的文本评论
        responseAddress: new TonWeb.utils.Address(fromAddr) // 扣除手续费后将TON退回给发件人的钱包地址
      })
      const payloadBase64 = Buffer.from(await payload.toBoc()).toString('base64')
      // console.log({payload})
      // console.log(jettonAmount, this.dstAddr, fromAddr, jettonFeeAmount)
      console.log('payload', payloadBase64)
      // console.log('body', body.toBoc().toString('base64'))
      // return
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [{
          address: fromJettonAddr, // 发送方 Jetton 钱包
          amount: 0.05 * Math.pow(10, 9), // 用于手续费，超额部分将被退回
          payload: payloadBase64 // 带有 Jetton 转账 body
        }]
      }
      console.log(transaction)
      const result = await this.tonConnectUI.sendTransaction(transaction)
      console.log('payByUsdt', {result})
    },

    async payByTon() {
      const comment = Date.now() + ''
      const body = beginCell()
        .storeUint(0, 32) // 写入32个零位以表示后面将跟随文本评论
        .storeStringTail(comment) // 写下我们的文本评论
        .endCell();
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [{
          address: this.dstAddr,
          amount: 0.01 * Math.pow(10, 9), // 0.01
          payload: body.toBoc().toString("base64") // body中带有评论
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
