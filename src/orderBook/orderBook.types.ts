export type IProduct = {
    code: string
    id: string
    source: string
}

export type IOrder = [number, number];

export type IOrderWithTotal = [number, number, number];

export interface IOrderBook {
    bids: IOrder[];
    asks: IOrder[];
}

export interface IOrderBookProps {
    translation: {
        total: string;
        size: string;
        price: string;
        title: string;
        spread: string;
    };
    orderBook: IOrderBook;
}