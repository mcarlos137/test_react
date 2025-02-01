import Button from "../../components/button";
import { PRODUCTS } from "../orderBook.config";
import { IProduct } from "../orderBook.types";

interface IProps {
    availablePairsLabel: string
    toggleFeedLabel: string
    product: IProduct
    onClick: () => void
}

const Selector: React.FC<IProps> = ({ availablePairsLabel, toggleFeedLabel, product, onClick }) => {
    return (
        <>
            <p>{availablePairsLabel}:</p>
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
                onClick={onClick}>
                {toggleFeedLabel}
            </Button>
        </>
    );
};

export default Selector;