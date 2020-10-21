import React from 'react';

export default function Square({ isHighlight, onClick, value }) {
    return (
        <button className={`square ${isHighlight && 'highlight'}`} onClick={() => onClick()}>
            {value}
        </button>
    );
}
