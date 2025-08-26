import type { Square } from "../../../interfaces/square";

interface SquareProps {
    square: Square;
    onSquareClick: (x: number, y: number) => void;
}

const Square = ({ square, onSquareClick }: SquareProps) => {
    const isEmpty = square.square_value === null;

    return (
        <div data-testid={`square-${square.id}`}
            className={`w-full aspect-square rounded inset-shadow-sm flex items-center justify-center ${isEmpty ? 'bg-blue-400 cursor-pointer' : 'bg-gray-100'
                }` }
            onClick={() => isEmpty && onSquareClick(square.x, square.y)}
        >
            <h1 className="text-3xl font-black select-none">{square.square_value || ''}</h1>
        </div>
    );
};

export default Square;