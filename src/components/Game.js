import React from 'react';
import { useState } from 'react';
import Board from './Board';

export default function Game() {
    const [history, setHitory] = useState([
        {
            squares: Array(9).fill(null),
            curLocation: null,
        },
    ]);
    const [xIsNext, setXIsNext] = useState(true);
    const [stepNumber, setStepNumber] = useState(0);
    const [sortOrder, setSortOrder] = useState(true);

    function handleClick(i) {
        const updatedHistory = history.slice(0, stepNumber + 1);
        const current = updatedHistory[updatedHistory.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = xIsNext ? 'X' : 'O';
        setHitory(
            updatedHistory.concat([
                {
                    squares: squares,
                    curLocation: i,
                },
            ])
        );
        setStepNumber(updatedHistory.length);
        setXIsNext(!xIsNext);
    }

    function handleSortClick() {
        setSortOrder(!sortOrder);
    }

    function jumpTo(step) {
        setStepNumber(step);
        setXIsNext(step % 2 === 0);
    }

    const current = history[stepNumber];
    const result = calculateWinner(current.squares);
    let status;
    if (result) {
        status = 'Winner: ' + result.winner;
    } else if (!current.squares.includes(null)) {
        status = 'Draw';
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    let moves = [];
    if (sortOrder) {
        moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            const locationX = Math.floor(step.curLocation / 3);
            const locationY = step.curLocation % 3;
            return (
                <li key={move}>
                    <button
                        onClick={() => jumpTo(move)}
                        className={move === stepNumber ? 'bold-text' : ''}
                    >
                        {desc} ({locationX} - {locationY})
                    </button>
                </li>
            );
        });
    } else {
        for (let move = history.length - 1; move >= 0; move--) {
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            const locationX = Math.floor(history[move].curLocation / 3);
            const locationY = history[move].curLocation % 3;
            moves.push(
                <li key={move}>
                    <button
                        onClick={() => jumpTo(move)}
                        className={move === stepNumber ? 'bold-text' : ''}
                    >
                        {desc} ({locationX} - {locationY})
                    </button>
                </li>
            );
        }
    }

    return (
        <div className='game'>
            <div className='game-board'>
                <Board
                    wonLine={result ? result.wonLine : null}
                    squares={current.squares}
                    onClick={(i) => handleClick(i)}
                />
            </div>
            <div className='game-info'>
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
            <div className='game-btn'>
                <button onClick={() => handleSortClick()}>Sort</button>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                wonLine: [a, b, c],
            };
        }
    }
    return null;
}
