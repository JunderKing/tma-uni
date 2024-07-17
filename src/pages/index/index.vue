<template>
  <view class="content">
    <div style="width: 90vw;">USER: {{ initData.user }}</div>
    <div id="ton-connect"></div>
    <button @click="sendTx">PAY TON</button>
  </view>
</template>

<script>
import {TonConnectUI} from '@tonconnect/ui';

export default {
  data() {
    return {
      tonConnectUI: null,
      webApp: null,
      initData: {},
    }
  },
  onLoad() {
    this.webApp = window.window.Telegram.WebApp 
    console.log('webapp', window.window.Telegram.WebApp)
    this.initData = this.webApp.initDataUnsafe
  },
  onReady() {
    this.tonConnectUI = new TonConnectUI({
      manifestUrl: 'https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json',
      // manifestUrl: 'https://tma.charsoft.tech/static/tonconnect-manifest.json',
      buttonRootId: 'ton-connect'
    });
  },
  methods: {
    async connectWallet() {
      const connectedWallet = await this.tonConnectUI.connectWallet();
      console.log('wallet', connectedWallet)
    },
    async sendTx() {
      const transaction = {
        messages: [{
          address: "0:412410771DA82CBA306A55FA9E0D43C9D245E38133CB58F1457DFB8D5CD8892F", // 目标地址
          amount: "10000000" //以nanotons计的 0.1 Toncoin
        }]
      }
      const result = await this.tonConnectUI.sendTransaction(transaction)
      console.log({result})
    }
  },
}
</script>

<style>
.content {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
