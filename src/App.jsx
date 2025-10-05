import { useState, useMemo } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import './App.css';

function App() {
  const game = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(game.fen());
  const [message, setMessage] = useState('');

  function onDrop(sourceSquare, targetSquare) {
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // always promote to a queen for simplicity
    };

    try {
      const newGame = new Chess(game.fen());
      const result = newGame.move(move);
      if (result) {
        setFen(newGame.fen());
        updateGameStatus(newGame);
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  function updateGameStatus(currentGame) {
    if (currentGame.isCheckmate()) {
      setMessage(`Checkmate! ${currentGame.turn() === 'w' ? 'Black' : 'White'} wins.`);
    } else if (currentGame.isDraw()) {
      setMessage('Draw!');
    } else if (currentGame.isStalemate()) {
      setMessage('Stalemate!');
    } else if (currentGame.isThreefoldRepetition()) {
      setMessage('Threefold repetition!');
    } else if (currentGame.isInsufficientMaterial()) {
      setMessage('Insufficient material!');
    } else if (currentGame.inCheck()) {
      setMessage(`Check! ${currentGame.turn() === 'w' ? 'White' : 'Black'} to move.`);
    } else {
      setMessage(`${currentGame.turn() === 'w' ? 'White' : 'Black'} to move.`);
    }
  }

  function resetGame() {
    game.reset();
    setFen(game.fen());
    setMessage('White to move.');
  }

  return (
    <div className="app">
      <h1>Chess Game</h1>
      <div className="chessboard-container">
        <Chessboard position={fen} onPieceDrop={onDrop} />
      </div>
      <div className="game-status">{message}</div>
      <button className="reset-button" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );
}

export default App;
