export const EXTERNAL_BTC_PRODUCT_ID = 'PI_BTCUSD';
export const EXTERNAL_ETH_PRODUCT_ID = 'PI_ETHUSD';

export const EXTERNAL_BTC_CURRENCY_CODE = 'BTCUSD';
export const EXTERNAL_ETH_CURRENCY_CODE = 'ETHUSD';

export const PRODUCTS: { code: string; id: string }[] = [
  {
    id: EXTERNAL_BTC_PRODUCT_ID,
    code: EXTERNAL_ETH_PRODUCT_ID,
  },
  {
    id: EXTERNAL_BTC_CURRENCY_CODE,
    code: EXTERNAL_ETH_CURRENCY_CODE,
  },
];

export const EXTERNAL_FEED_SNAPSHOT = 'book_ui_1_snapshot';
export const EXTERNAL_FEED_DELTA = 'book_ui_1';

export const EVENT_SUBSCRIBE = 'subscribe';
export const EVENT_UNSUBSCRIBE = 'unsubscribe';

export const webSocketUrl = 'wss://www.cryptofacilities.com/ws/v1';
export const webSocketUrl_local = 'ws://localhost:8082/data';
export const webSocketSource: 'local' | 'remote' = 'local'
