import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button
      className={"square " + (props.winningSquare ? "highlight-square" : "")}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, winningSquare) {
    return (
      <Square
        key={i}
        winningSquare={winningSquare}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const squareBoard = [0, 1, 2].map(i => (
      <div key={i} className="board-row">
        {[0, 1, 2].map(j => {
          const squareNum = i * 3 + j;
          let winningSquare = false;
          this.props.winner.cells.filter(value => {
            if (squareNum === value) winningSquare = true;
          });
          return this.renderSquare(squareNum, winningSquare);
        })}
      </div>
    ));
    return <div>{squareBoard}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          xIsNext: true,
          currentMove: null
        }
      ],
      current: 0
    };
  }

  handleClick(i) {
    let current = this.state.current;
    const curState = this.state.history[current];
    const squares = curState.squares.slice();
    if (squares[i] || calculateWinner(squares).winner) return;
    squares[i] = curState.xIsNext ? "X" : "O";
    current++;
    this.setState({
      history: this.state.history.slice(0, current).concat({
        squares,
        xIsNext: !curState.xIsNext,
        currentMove: [i % 3, Math.floor(i / 3)]
      }),
      current
    });
  }

  goBack(index) {
    this.setState({ current: index });
  }

  render() {
    const squares = this.state.history[this.state.current].squares;
    const winner = calculateWinner(squares);
    let status = `Next player: ${
      this.state.history[this.state.current].xIsNext ? "X" : "O"
    }`;
    if (winner.winner) {
      status = `Winner: ${winner.winner}`;
    } else if (squares.filter(val => val != null).length === squares.length) {
      status = `Match DRAW !!`;
    }
    const steps = this.state.history.map((value, index) => {
      if (index !== 0)
        return {
          text: `Go To Step ${index - 1}`,
          moves: value.currentMove
        };
      return { text: "Go To Game Start", moves: null };
    });
    const stepsList = steps.map((step, index) => (
      <li key={index}>
        <button
          className={this.state.current === index ? "current-move" : ""}
          onClick={() => this.goBack(index)}
        >
          {step.text}
        </button>
        <span className="step-col-row">
          {step.moves ? step.moves[0] + " " + step.moves[1] : ""}
        </span>
      </li>
    ));
    return (
      <div className="game">
        <div className="game-board">
          <Board
            winner={winner}
            squares={squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{stepsList}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

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
      return { winner: squares[a], cells: [a, b, c] };
    }
  }
  return { winner: null, cells: [] };
}
