import Button from "../../components/button";

const Paused: React.FC<{buttonLabel: string, pausedLabel: string, paused: boolean, onClick: () => void }> = ({ buttonLabel, pausedLabel, paused, onClick }) => {
    return (
        <>
            {paused && (
                <div className="absolute bg-black/80 top-0 right-0 bottom-0 left-0 z-10 flex items-center justify-center">
                    <div className="text-center bg-black p-8 rounded-lg">
                        <p className="mb-8">{pausedLabel}</p>
                        <Button
                            onClick={onClick}>
                            {buttonLabel}
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Paused;