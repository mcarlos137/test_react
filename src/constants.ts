export const REMOTE_XBT_PRODUCT_ID = 'PI_XBTUSD';
export const REMOTE_ETH_PRODUCT_ID = 'PI_ETHUSD';
export const LOCAL_BTC_PRODUCT_ID = 'binance.BTC-USDT';
export const LOCAL_ETH_PRODUCT_ID = 'binance.ETH-USDT';

export const REMOTE_XBT_CURRENCY_CODE = 'REMOTE XBTUSD';
export const REMOTE_ETH_CURRENCY_CODE = 'REMOTE ETHUSD';
export const LOCAL_BTC_CURRENCY_CODE = 'LOCAL BTC-USDT';
export const LOCAL_ETH_CURRENCY_CODE = 'LOCAL ETH-USDT';

export const PRODUCTS: { code: string; id: string, source: string }[] = [
  {
    id: REMOTE_XBT_PRODUCT_ID,
    code: REMOTE_XBT_CURRENCY_CODE,
    source: 'REMOTE'
  },
  {
    id: REMOTE_ETH_PRODUCT_ID,
    code: REMOTE_ETH_CURRENCY_CODE,
    source: 'REMOTE'
  },
  /*{
    id: LOCAL_BTC_PRODUCT_ID,
    code: LOCAL_BTC_CURRENCY_CODE,
    source: 'LOCAL'
  },*/
  {
    id: LOCAL_ETH_PRODUCT_ID,
    code: LOCAL_ETH_CURRENCY_CODE,
    source: 'LOCAL'
  },
];

export const EXTERNAL_FEED_SNAPSHOT = 'book_ui_1_snapshot';
export const EXTERNAL_FEED_DELTA = 'book_ui_1';

export const EVENT_SUBSCRIBE = 'subscribe';
export const EVENT_UNSUBSCRIBE = 'unsubscribe';

export const webSocketUrlLocal = 'ws://localhost:8082/data'
export const webSocketUrlRemote = 'wss://www.cryptofacilities.com/ws/v1'

export const getMessageRequestLocal = (event: string, productId: string) => {
  const request = {
    "method": event.toUpperCase(),
    "operation": "orderBook",
    "channel": productId
  }
  console.log('LOCAL-------->', request)
  return request
}

export const getMessageRequestRemote = (event: string, productId: string) => {
  const request = {
    event,
    feed: EXTERNAL_FEED_DELTA,
    product_ids: [productId],
  }
  console.log('REMOTE-------->', request)
  return request
}
