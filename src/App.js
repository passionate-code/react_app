import { useState } from 'react';

function Square({val,childClick,colouring}) {
  return (
    <button className={`square ${colouring?"colouring":""}`} onClick={childClick}>
      {val}
    </button>
  );
}

function Board({currentmove,squares,onPlay}) {
  const win_state = calculateWinner(squares);
  const winner = win_state?win_state.winner:null;
  const winning_arr = win_state?win_state.winning_squares:[];
  let message;
  if (winner) {
    message = `Game ended! Congratulation to player ${winner} for winning the tic tac toe game!`;
  } else if (!squares.includes(null)) {
    message = `Game over and it is a tie!`;
  } else {
    message = `Next up player ${(currentmove%2 === 0) ? "X" : "O"}!`;
  }
  function handleClick(i) {
    const new_squares = squares.slice();
    if (new_squares[i] === null && !calculateWinner(squares)) {
      if (currentmove%2 === 0) {
        new_squares[i] = "X";
      } else {
        new_squares[i] = "O";
      }
      onPlay(new_squares,i);
    }
  }
  const boardsize = 3;
  function GetRow({row_no}) {
    const row = [];
    for (let i=0; i<boardsize; i++) {
      const index = row_no*3+i;
      let highlight;
      if (winning_arr.includes(index)) {
        highlight = true;
      } else {
        highlight = false;
      }
      row.push(<Square key={index} val={squares[index]} childClick={() => handleClick(index)} colouring={highlight}/>);
    }
    return (
      <>
        {row}
      </>
    );
  }
  function GetBoard() {
    const board = [];
    for (let i=0; i<boardsize; i++) {
      board.push(<div key={i} className="board-row"><GetRow row_no={i}/></div>);
    }
    return (
      <>
        {board}
      </>
    );
  }
  return (
    <>
      <div className="status">{message}</div>
      <GetBoard/>
    </>
  );
}

export default function Game() {
  const [history,setHistory] = useState([{"squares":Array(9).fill(null),"changed_square":null}]);
  const [moveno,setMoveno] = useState(0);
  const [order,setOrder] = useState(true);
  const current_squares = history[moveno].squares;
  function handlePlay(nextSquares,changeIndex) {
    const historyMove = [...history.slice(0,moveno+1),{"squares":nextSquares,"changed_square":changeIndex}];
    setHistory(historyMove);
    setMoveno(moveno+1);
  }
  function revisitSquares(indexMove) {
    setMoveno(indexMove);
  }
  function handleToogle() {
    setOrder(!order);
  } 
  const moves = history.map((historyIns,index) => {
    const changedSquare = historyIns.changed_square;
    const row = Math.floor(changedSquare/3)+1;
    const col = changedSquare%3+1;
    let description;
    if (index > 0) {
      description = `Go to move (${row},${col})`;
    } else {
      description = `Go to game start`;
    }
    if (index != moveno) {
      return (
        <li key={index}>
          <button onClick={() => revisitSquares(index)}>
            {description}
          </button>
        </li>
      );
    } else {
      return (
        <li key={index}>
          {description}
        </li>
      );
    }
  });
  if (!order) {
    moves.reverse();
  }
  return (
      <div className="game">
        <div className="game-board">
          <Board currentmove={moveno} squares={current_squares} onPlay={handlePlay}/>
        </div>
        <div className="game-info">
          <button onClick={handleToogle}>
            Moves in {order?"ascending":"descending"} order
          </button>
          <ol>{moves}</ol>
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
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {"winner":squares[a],"winning_squares":[a, b, c]};
    }
  }
  return null;
}

