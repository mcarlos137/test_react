import { IOrderWithTotal } from "../orderBook.types";
import { calculateRowDepth } from "../orderBook.utils";

const Asks: React.FC<{
    totalLabel: string,
    sizeLabel: string,
    priceLabel: string,
    highestTotal: number,
    asks: IOrderWithTotal[]
}> = ({ totalLabel, sizeLabel, priceLabel, highestTotal, asks }) => {
    return (
        <>
            {!!asks.length ? (
                <div data-testid="order-book-asks" className="flex-1">
                    <table className="w-full">
                        <thead>
                            <tr className="text-gray-500">
                                <th className="text-right p-1 pr-8 font-semibold">
                                    {priceLabel}
                                </th>
                                <th className="text-right p-1 pr-8 font-semibold">
                                    {sizeLabel}
                                </th>
                                <th className="text-right p-1 pr-8 font-semibold">
                                    {totalLabel}
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {asks.map(([price, size, total]) => {
                                if (!price || !size || !total) {
                                    return null;
                                }

                                const rowDepth = calculateRowDepth(total, highestTotal);
                                const stop = 100 - rowDepth;
                                return (
                                    <tr
                                        key={`${price}-${size}-${total}`}
                                        style={{
                                            background: `linear-gradient(to left, transparent ${stop}%, rgb(127 29 29) ${stop}%)`,
                                        }}>
                                        <td
                                            data-testid="grid-cell"
                                            className="text-right p-1 pr-8 font-semibold text-red-500">
                                            {price}
                                        </td>
                                        <td
                                            data-testid="grid-cell"
                                            className="text-right p-1 pr-8 font-semibold">
                                            {size}
                                        </td>
                                        <td
                                            data-testid="grid-cell"
                                            className="text-right p-1 pr-8 font-semibold">
                                            {total}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : null}
        </>
    );
};

export default Asks;