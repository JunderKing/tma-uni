## TG登录
1.1 引入TG库 (方式一)
```js
<script src="https://telegram.org/js/telegram-web-app.js"></script>
const webApp = window.window.Telegram.WebApp
```
1.2 引入TG库（方式二)
```js
yarn add 'twa-dev/sdk'
import WebApp from '@twa-dev/sdk'
```
2 获取用户信息
```js
webApp.initDataUnsafe // 可读取用户tgId等信息
webApp.initData // 传给后端，后端校验后使用
```
3 获取启动参数
```js
// https://t.me/KingV5Bot/TrueGame?startapp=XXX
onLoad(query) {
  console.log(query.tgWebAppStartParam) // tgWebAppStartParam为startapp传入的值
}
```

## TON支付
1. 安装依赖
```shell
yarn add @tonconnect/ui
```
2. 创建manifest
```json
{
  "url": "https://tma.charsoft.tech", // 必填
  "name": "TrueGame", // 必填
  "iconUrl": "https://ton-connect.github.io/demo-dapp-with-react-ui/apple-touch-icon.png" // 必填
}
```
3. 实例化UI对象
```js
const tonConnectUI = new TonConnectUI({
  manifestUrl: 'https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json',
});
```
4. 获取用户钱包信息，监听钱包变更
```js
this.currentWallet = tonConnectUI.wallet;
const unsubscribe = this.tonConnectUI.onStatusChange(wallet => {
  this.currentWallet = wallet
})
```
5. 点击连接钱包，唤起弹窗
```js
const connectedWallet = await tonConnectUI.connectWallet();
```
6. 使用TON支付
```js
const transaction = {
  validUntil: Math.floor(Date.now() / 1000) + 360, // 过期时间
  messages: [{
    address: this.tonWallet, // 目标地址
    amount: 10000000, // 数量 * pow(10, 9)
  }]
}
const result = await this.tonConnectUI.sendTransaction(transaction)
```

## STAR支付
1. 创建支付链接(通过服务端接口创建，tgToken不要放在客户端)
```js
const resp = await this.botApi('createInvoiceLink', {
  title: 'PAY_TITLE',
  description: 'PAY_DESC',
  payload: 'PAY_PAYLOAD',
  currency: 'XTR', // star支付固定值
  prices: '[{"amount":1,"label":"LABEL"}]'
})
const link = resp.data.result
```
2. 打开订单
```js
webApp.openInvoice(link)
```
3. 服务端支付前确认 (server_bot.js)
```js
bot.on("pre_checkout_query", (ctx) => {
  console.log('pre_checkout_query')
  return ctx.answerPreCheckoutQuery(true).catch(() => {
    console.error("answerPreCheckoutQuery failed");
  });
});
```
4. 服务端完成支付 (server_bot.js)
```js
// 支付成功
bot.on("message:successful_payment", (ctx) => {
  console.log('message:successful_payment')
  if (!ctx.message || !ctx.message.successful_payment || !ctx.from) {
    return;
  }
  // ctx.message.successful_payment.telegram_payment_charge_id 为订单ID
});
```