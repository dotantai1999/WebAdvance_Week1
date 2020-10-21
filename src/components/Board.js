import React from 'react';
import Square from './Square';

export default function Board({ squares, onClick, wonLine }) {
    function renderSquare(i, isHighlight) {
        return (
            <Square
                isHighlight={isHighlight}
                key={i}
                value={squares[i]}
                onClick={() => onClick(i)}
            />
        );
    }

    let board = Array(3).fill(null);
    return (
        <div>
            {board.map((it, i) => {
                let row = Array(3).fill(null);
                return (
                    <div key={i} className='board-row'>
                        {row.map((item, j) => {
                            let pos = i * 3 + j;
                            if (wonLine && wonLine.includes(pos)) return renderSquare(pos, true);
                            else return renderSquare(pos, false);
                        })}
                    </div>
                );
            })}
        </div>
    );
}
