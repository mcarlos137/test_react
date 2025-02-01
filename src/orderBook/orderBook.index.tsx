import React, { useCallback, useEffect, useMemo, useState } from "react";
import useWebSocket from "react-use-websocket";
import { IOrderBook, IOrderWithTotal } from "./orderBook.types";
import { calculateHighestTotal, calculateTotals, reduceOrders, transformStringData } from "./orderBook.utils";
import { EVENT_SUBSCRIBE, EVENT_UNSUBSCRIBE, EXTERNAL_FEED_DELTA, EXTERNAL_FEED_SNAPSHOT, getMessageRequestLocal, getMessageRequestRemote, PRODUCTS, TRANSLATION, WEBSOCKET_URL_LOCAL, WEBSOCKET_URL_REMOTE } from "./orderBook.config";
import Container from "../components/container";
import Header from "../components/header";
import Body from "../components/body";
import Footer from "../components/footer";
import Paused from "./paused";
import Spread from "./spread";
import Bids from "./bids";
import Asks from "./asks";
import Headline from "./headline";
import Selector from "./selector";

const OrderBook = () => {

    // STATES
    const [orderBook, setOrderBook] = useState<IOrderBook>({ bids: [], asks: [] });
    const [product, setProduct] = useState(PRODUCTS[0]);
    const [paused, setPaused] = useState(false);

    // MEMOS
    const bids: IOrderWithTotal[] = useMemo(() => calculateTotals(orderBook.bids.slice(0, 25)
    ), [orderBook.bids]);
    const asks: IOrderWithTotal[] = useMemo(() => calculateTotals(orderBook.asks.slice(0, 25)
    ), [orderBook.asks]);
    const highestTotal = useMemo(() => calculateHighestTotal([...bids, ...asks]
    ), [bids, asks]);

    // WEBSOCKETS
    const { sendJsonMessage: sendJsonMessageLocal, lastMessage: lastMessageLocal, readyState: readyStateLocal } = useWebSocket(
        WEBSOCKET_URL_LOCAL, { shouldReconnect: () => true }
    );
    const { sendJsonMessage: sendJsonMessageRemote, lastMessage: lastMessageRemote, readyState: readyStateRemote } = useWebSocket(
        WEBSOCKET_URL_REMOTE, { shouldReconnect: () => true }
    );

    // CALLBACKS
    const sendDeltaMessage = useCallback(
        (event: string) => {
            if (product.source === 'LOCAL') {
                sendJsonMessageLocal(getMessageRequestLocal(event, product.id))
            } else if (product.source === 'REMOTE') {
                sendJsonMessageRemote(getMessageRequestRemote(event, product.id))
            }
        },
        [product, sendJsonMessageLocal, sendJsonMessageRemote],
    );

    // EFFECTS
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
            <Paused buttonLabel={TRANSLATION.reconnect} pausedLabel={TRANSLATION.paused} paused={paused} onClick={() => {
                sendDeltaMessage(EVENT_SUBSCRIBE);
                setPaused(false);
            }} />

            <Header>
                <Headline pairLabel={TRANSLATION.pair} orderBook={orderBook} product={product} />
                <Spread titleLabel={TRANSLATION.title} spreadLabel={TRANSLATION.spread} orderBook={orderBook} />
            </Header>

            <Body>
                <>
                    <Bids
                        priceLabel={TRANSLATION.price}
                        totalLabel={TRANSLATION.total}
                        sizeLabel={TRANSLATION.size}
                        highestTotal={highestTotal}
                        bids={bids}
                    />
                    <Asks
                        priceLabel={TRANSLATION.price}
                        totalLabel={TRANSLATION.total}
                        sizeLabel={TRANSLATION.size}
                        highestTotal={highestTotal}
                        asks={asks}
                    />
                </>
            </Body>

            <Footer>
                <Selector
                    availablePairsLabel={TRANSLATION.availablePairs}
                    toggleFeedLabel={TRANSLATION.toggleFeed}
                    product={product}
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
                        })}
                />
            </Footer>
        </Container>
    );

}

export default React.memo(OrderBook)