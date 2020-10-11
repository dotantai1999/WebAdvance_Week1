import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    render() {
        return (
            <button
                className={`square ${this.props.isHighlight && 'highlight'}`}
                onClick={() => this.props.onClick()}
            >
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    renderSquare(i, isHighlight) {
        return (
            <Square
                isHighlight={isHighlight}
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        let board = [];
        for (let i = 0; i < 3; i++) {
            let row = Array(3).fill(null);
            board.push(
                <div key={i} className='board-row'>
                    {row.map((item, j) => {
                        const pos = i * 3 + j;
                        if (this.props.wonLine && this.props.wonLine.includes(pos))
                            return this.renderSquare(pos, true);
                        else return this.renderSquare(pos, false);
                    })}
                </div>
            );
        }

        // let board = Array(3).fill(null);
        // board.map((it, i) => {
        //     let row = Array(3).fill(null);
        //     return (
        //         <div key={i} className='board-row'>
        //             {row.map((item, j) => {
        //                 return this.renderSquare(i * 3 + j);
        //             })}
        //         </div>
        //     );
        // });

        return <div>{board}</div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    curLocation: null,
                },
            ],
            xIsNext: true,
            stepNumber: 0,
            sortOrder: true, // ascending
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    curLocation: i,
                },
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    handleSortClick() {
        this.setState({
            sortOrder: !this.state.sortOrder,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const result = calculateWinner(current.squares);
        let status;
        if (result) {
            status = 'Winner: ' + result.winner;
        } else if (!current.squares.includes(null)) {
            status = 'Draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        let moves = [];
        if (this.state.sortOrder) {
            moves = history.map((step, move) => {
                const desc = move ? 'Go to move #' + move : 'Go to game start';
                const locationX = Math.floor(step.curLocation / 3);
                const locationY = step.curLocation % 3;
                return (
                    <li key={move}>
                        <button
                            onClick={() => this.jumpTo(move)}
                            className={move === this.state.stepNumber ? 'bold-text' : ''}
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
                            onClick={() => this.jumpTo(move)}
                            className={move === this.state.stepNumber ? 'bold-text' : ''}
                        >
                            {desc} ({locationX} - {locationY})
                        </button>
                    </li>
                );
            }
            // moves = history.map((step, move) => {
            //     const desc = move ? 'Go to move #' + move : 'Go to game start';
            //     const locationX = Math.floor(step.curLocation / 3);
            //     const locationY = step.curLocation % 3;
            //     return (
            //         <li key={move}>
            //             <button
            //                 onClick={() => this.jumpTo(move)}
            //                 className={move === this.state.stepNumber ? 'bold-text' : ''}
            //             >
            //                 {desc} ({locationX} - {locationY})
            //             </button>
            //         </li>
            //     );
            // });
        }

        return (
            <div className='game'>
                <div className='game-board'>
                    <Board
                        wonLine={result ? result.wonLine : null}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className='game-info'>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
                <div className='game-btn'>
                    <button onClick={() => this.handleSortClick()}>Sort</button>
                </div>
            </div>
        );
    }
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

ReactDOM.render(<Game />, document.getElementById('root'));
