import { IOrder } from '../orderBook.types';
import { reduceOrders } from '../orderBook.utils';

describe('reduceOrders', () => {
  describe('given previousOldOrders', () => {
    const previousOldOrders: IOrder[] = [[40005, 10]];

    describe('given removal of order', () => {
      const order: IOrder = [40005, 0];

      it('removes order', () => {
        const result = reduceOrders(previousOldOrders, order);
        expect(result).toEqual([]);
      });
    });

    describe('given update of order', () => {
      const order: IOrder = [40005, 100];

      it('removes order', () => {
        const result = reduceOrders(previousOldOrders, order);
        expect(result).toEqual([[40005, 100]]);
      });
    });

    describe('given addition of order', () => {
      const order: IOrder = [40010, 100];

      it('adds order', () => {
        const result = reduceOrders(previousOldOrders, order);
        expect(result).toEqual([
          [40005, 10],
          [40010, 100],
        ]);
      });
    });
  });
});
