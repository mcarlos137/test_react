import React from 'react';
import { IOrder, IOrderBook } from '../orderBook.types';
import { calculateSpread, calculateSpreadPercent } from '../orderBook.utils';
import Heading from '../../components/heading';

interface IProps {
  titleLabel: string
  spreadLabel: string
  orderBook: IOrderBook
}

export const getTopOrder = (orders: IOrder[]) => orders[0][0];
export const round = (number: number) => Math.round((number + Number.EPSILON) * 100) / 100;
export const validateOrders = (bids: IOrder[], asks: IOrder[]) => bids && bids.length && asks && asks.length;

const Spread: React.FC<IProps> = ({ titleLabel, spreadLabel, orderBook }): null | JSX.Element => {
  const { bids, asks } = orderBook;
  if (!validateOrders(bids, asks)) {
    return null;
  }
  const topAsk = getTopOrder(asks);
  const topBid = getTopOrder(bids);
  const spread = calculateSpread(topAsk, topBid);
  const spreadPercentage = calculateSpreadPercent(spread, topAsk);

  return (
    <header className="flex p-4 space-between">
      {!!titleLabel && <Heading>{titleLabel}</Heading>}
      <div className="mx-auto -translate-x-1/4">
        <div className="text-center text-gray-500">
          {!!spreadLabel && <span>{spreadLabel}:</span>} {round(spread)} ({round(spreadPercentage)}%)
        </div>
      </div>
    </header>
  );
};

export default Spread;
