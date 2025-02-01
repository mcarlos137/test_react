import { IOrder, IOrderWithTotal } from "./orderBook.types";

export const calculateHighestTotal = (array: IOrderWithTotal[]) =>
    array
        .map(([, , total]) => total)
        .reduce(
            (previousValue, total) => (total > previousValue ? total : previousValue),
            0,
        );

export const calculateRowDepth = (total: number, highestTotal: number) => (total / (highestTotal ? highestTotal : 1)) * 100;

export const calculateSpread = (ask: number, bid: number) => ask - bid;

export const calculateSpreadPercent = (spread: number, ask: number) => (spread / ask) * 100;

export const calculateTotals = (rows: IOrder[]): IOrderWithTotal[] => {
    let total = 0;
    return rows.map(([price, size]) => {
        total = total + size;
        return [price, size, total];
    });
};

export const getTopOrder = (orders: IOrder[]) => orders.length && orders[0][0]

export const transformStringData = (data: string[][], priceDecimals: number, amountDecimals: number) => {
    const transformedData: number[][] = []
    for (let d of data) {
        transformedData.push([Number(Number(d[0]).toFixed(priceDecimals)), Number(Number(d[1]).toFixed(amountDecimals))])
    }
    return transformedData
}

export const reduceOrders = (
    previousOrders: IOrder[],
    order: IOrder,
) => {
    const [price, size] = order;
    // remove zero sized orders
    if (size === 0) {
        return previousOrders.filter((oldOrder) => oldOrder[0] !== price);
    }

    // updates
    if (size > 0) {
        // update old prices with new sizes
        if (previousOrders.find((oldOrder) => oldOrder[0] === price)) {
            return previousOrders.map((oldOrder) =>
                oldOrder[0] === price ? order : oldOrder,
            );
        }

        // add new prices
        return [...previousOrders, order];
    }

    return previousOrders;
};

