import { IOrderWithTotal } from "../orderBook.types";
import { calculateRowDepth } from "../orderBook.utils";

const Bids: React.FC<{
    totalLabel: string,
    sizeLabel: string,
    priceLabel: string,
    highestTotal: number,
    bids: IOrderWithTotal[],
}> = ({ totalLabel, sizeLabel, priceLabel, highestTotal, bids }) => {
    return (
        <>
            {!!bids.length ? (
                <div data-testid="order-book-bids" className="flex-1">
                    <table className="w-full table-fixed">
                        <thead>
                            <tr className="text-gray-500">
                                <th className="text-right p-1 pr-8 font-semibold">
                                    {totalLabel}
                                </th>
                                <th className="text-right p-1 pr-8 font-semibold">
                                    {sizeLabel}
                                </th>
                                <th className="text-right p-1 pr-8 font-semibold">
                                    {priceLabel}
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {bids.map(([price, size, total]) => {
                                // @TODO: refactor to remove duplication between bids/asks
                                if (!price || !size || !total) {
                                    return null;
                                }

                                const rowDepth = calculateRowDepth(total, highestTotal);
                                const stop = 100 - rowDepth;

                                // @TODO: refactor column order to ordering is handled via css (will help with refactoring to remove duplication)
                                return (
                                    <tr
                                        key={`${price}-${size}-${total}`}
                                        style={{
                                            background: `linear-gradient(to right, transparent ${stop}%, rgb(20 83 45) ${stop}%)`,
                                        }}>
                                        <td
                                            data-testid="grid-cell"
                                            className="text-right p-1 pr-8 font-semibold">
                                            {total}
                                        </td>
                                        <td
                                            data-testid="grid-cell"
                                            className="text-right p-1 pr-8 font-semibold">
                                            {size}
                                        </td>
                                        <td
                                            data-testid="grid-cell"
                                            className="text-right p-1 pr-8 font-semibold text-green-500">
                                            {price}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : null
            }
        </>
    );
};

export default Bids;