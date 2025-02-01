import { PRODUCTS } from "../orderBook.config";
import { IOrderBook, IProduct } from "../orderBook.types";

interface IProps {
    pairLabel: string
    orderBook: IOrderBook
    product: IProduct;
}

const Headline: React.FC<IProps> = ({ pairLabel, orderBook, product }) => {
    return (
        <header className="p-4 pt-8">
            <p className="mb-4 text-center">
                {pairLabel}:{' '}
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
    );
};

export default Headline;