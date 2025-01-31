import React, { useCallback, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import Container from './components/container';
import OrderBook from './components/order-book';

import { IOrderBook } from './components/order-book/types';

import transformStringData from './components/order-book/transform-string-data';

import { translation } from './translation';
import {
  EVENT_SUBSCRIBE,
  EVENT_UNSUBSCRIBE,
  EXTERNAL_FEED_DELTA,
  EXTERNAL_FEED_SNAPSHOT,
  getMessageRequestLocal,
  getMessageRequestRemote,
  PRODUCTS,
  webSocketUrlLocal,
  webSocketUrlRemote,
} from './constants';
import Button from './components/button/button';
import { reduceOrders } from './reduce-orders';

const App = () => {

  const [orderBook, setOrderBook] = useState<IOrderBook>({
    bids: [],
    asks: [],
  });
  const [product, setProduct] = useState(PRODUCTS[0]);
  const [paused, setPaused] = useState(false);

  const { sendJsonMessage: sendJsonMessageLocal, lastMessage: lastMessageLocal, readyState: readyStateLocal } = useWebSocket(
    webSocketUrlLocal,
    {
      // Will attempt to reconnect on all close events, such as server shutting down
      shouldReconnect: () => true,
    },
  );

  const { sendJsonMessage: sendJsonMessageRemote, lastMessage: lastMessageRemote, readyState: readyStateRemote } = useWebSocket(
    webSocketUrlRemote,
    {
      // Will attempt to reconnect on all close events, such as server shutting down
      shouldReconnect: () => true,
    },
  );

  const sendDeltaMessage = useCallback(
    (event: string) => {
      if(product.source === 'LOCAL'){
        sendJsonMessageLocal(getMessageRequestLocal(event, product.id))
      } else if(product.source === 'REMOTE') {
        sendJsonMessageRemote(getMessageRequestRemote(event, product.id))
      }
    },
    [product, sendJsonMessageLocal, sendJsonMessageRemote],
  );

  // watch websocket readyState
  useEffect(() => {
    // if okay
    if (readyStateLocal === 1) {
      // if paused, we just unsubscribed
      if (paused) {
        return;
      }
      sendDeltaMessage(EVENT_SUBSCRIBE.toUpperCase());
    }
    if (readyStateRemote === 1) {
      // if paused, we just unsubscribed
      if (paused) {
        return;
      }
      sendDeltaMessage(EVENT_SUBSCRIBE);
    }
  }, [paused, product, readyStateLocal, readyStateRemote, sendDeltaMessage]);

  // watch for new message
  useEffect(() => {
    if (lastMessageLocal !== null) {
      const data = JSON.parse(lastMessageLocal.data);
      if (!data['asks'] || !data['bids']) {
        return
      }
      var { bids, asks } = data;
      bids = transformStringData(bids, 2, 5)
      asks = transformStringData(asks, 2, 5)
      setOrderBook({ bids, asks });
    }
  }, [lastMessageLocal]);

  // watch for new message
  useEffect(() => {
    if (lastMessageRemote !== null) {
      const data = JSON.parse(lastMessageRemote.data);
      const { bids, asks } = data;
      const { feed } = data
      // snapshot message
      if (feed === EXTERNAL_FEED_SNAPSHOT) {
        setOrderBook({ bids, asks });
      }
      // delta message
      if (feed === EXTERNAL_FEED_DELTA) {
        if ((bids && bids.length) || (asks && asks.length)) {
          setOrderBook(({ asks: oldAsks, bids: oldBids }) => ({
            // @TODO: DRY setOrderBook array chaining
            asks: asks
              .reduce(reduceOrders, oldAsks)
              // sort ascending
              .sort((a: [number], b: [number]) => a[0] - b[0]),
            bids: bids
              .reduce(reduceOrders, oldBids)
              // sort descending
              .sort((a: [number], b: [number]) => b[0] - a[0]),
          }));
        }
      }
    }
  }, [lastMessageRemote]);


  // User has switched away from the tab (AKA tab is hidden)
  const onBlur = () => {
    sendDeltaMessage(EVENT_UNSUBSCRIBE);
    setPaused(true);
  };

  // bind events
  useEffect(() => {
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('blur', onBlur);
    };
  });

  return (
    <Container>
      {paused && (
        <div className="absolute bg-black/80 top-0 right-0 bottom-0 left-0 z-10 flex items-center justify-center">
          <div className="text-center bg-black p-8 rounded-lg">
            <p className="mb-8">{translation.paused}</p>
            <Button
              onClick={() => {
                sendDeltaMessage(EVENT_SUBSCRIBE);
                setPaused(false);
              }}>
              {translation.reconnect}
            </Button>
          </div>
        </div>
      )}

      <header className="p-4 pt-8">
        <p className="mb-4 text-center">
          {translation.pair}:{' '}
          <span className="font-semibold">
            {PRODUCTS.length &&
              PRODUCTS.find((p) => p?.id === product.id)?.code}
          </span>
        </p>

        <table className="table-fixed min-w-full text-center">
          <thead>
            <tr>
              <th>Bid</th>
              <th>Ask</th>
            </tr>
          </thead>
          <tbody>
            <tr className="font-bold text-lg">
              <td className="w-1/2 text-green-500">
                {orderBook.bids.length && orderBook.bids[0][0]}
              </td>
              <td className="w-1/2 text-red-500">
                {orderBook.asks.length && orderBook.asks[0][0]}
              </td>
            </tr>
          </tbody>
        </table>
      </header>

      <OrderBook translation={translation} orderBook={orderBook} />

      <div className="text-center p-8">
        <p>{translation.availablePairs}:</p>
        <ul className="mb-4">
          {PRODUCTS.map((p) => {
            return (
              <li
                key={p.id}
                className={p.id === product.id ? 'font-bold' : ''}>
                {p.code}
              </li>
            );
          })}
        </ul>
        <Button
          onClick={() =>
            setProduct((oldFeed) => {
              const index = PRODUCTS.findIndex(
                (p) => p.id === product.id,
              );
              if (PRODUCTS[index].source === 'LOCAL') {
                sendJsonMessageLocal(getMessageRequestLocal(EVENT_UNSUBSCRIBE, oldFeed.id));
              } else if (PRODUCTS[index].source === 'REMOTE') {
                sendJsonMessageRemote(getMessageRequestRemote(EVENT_UNSUBSCRIBE, oldFeed.id));
              }
              return index + 1 === PRODUCTS.length
                ? PRODUCTS[0]
                : PRODUCTS[index + 1];
            })
          }>
          {translation.toggleFeed}
        </Button>
      </div>
    </Container>
  );
};

export default App;
