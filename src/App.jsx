import './App.css';
import PicTiles from './components/PicTiles';

function App() {
  return (
    <div className="App">
      <div className="container">
        <h1>Tile Swapper Game</h1>
        <p>Click on two tiles in a row to swap them until image is complete</p>
        <PicTiles></PicTiles>
      </div>
    </div>
  );
}

export default App;
