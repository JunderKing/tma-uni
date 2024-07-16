<template>
  <view class="content">
    <div id="ton-connect"></div>
    <!-- <button @click="connectWallet">CONNECT</button> -->
  </view>
</template>

<script>
import {TonConnectUI} from '@tonconnect/ui';

export default {
  data() {
    return {
      tonConnectUI: null
    }
  },
  onReady() {
    this.tonConnectUI = new TonConnectUI({
      manifestUrl: 'https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json',
      buttonRootId: 'ton-connect'
    });
  },
  methods: {
    async connectWallet() {
      const connectedWallet = await this.tonConnectUI.connectWallet();
      console.log(connectedWallet)
    }
  },
}
</script>

<style>
.content {
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
