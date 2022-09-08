import React, { useEffect, useState } from "react";
import axios from 'axios';
import './PicTiles.css'

const key = process.env.REACT_APP_PIC_API_KEY;


//ADD EASY,MED,HARD MODES FOR EXTRA FEATURES FOR USER TO CHOOSE
const easyMode = {
    name: 'EASY',
    url: `https://www.rijksmuseum.nl/api/nl/collection/SK-C-5/tiles?key=${key}`,
    level: 1,
}
const mediumMode = {
    name: 'MEDIUM',
    url: `https://www.rijksmuseum.nl/api/nl/collection/SK-A-4688/tiles?key=${key}`,
    level: 1,
}
const hardMode = {
    name: 'HARD',
    url: `https://www.rijksmuseum.nl/api/nl/collection/SK-A-1718/tiles?key=${key}`,
    level: 0,
};

const modeOptions = [easyMode,mediumMode,hardMode];

const PicTiles = () => {

    const [data,setData] = useState({});
    const [pictureTiles,setPictureTiles] = useState([]);
    const [sortedTiles,setSortedTiles] = useState([]);
    const [selectedTileID,setSelectedTileID] = useState(null);
    const [solved,setSolved] = useState(false);
    const [moves,setMoves] = useState(0);
    const [reset,setReset] = useState(false);
    const [mode,setMode] = useState(easyMode);

    //RETRIEVE TILE DATA
    useEffect(() => {
        axios.get(mode.url)
            .then( res => {
                setData(res.data.levels[mode.level]);
                let tilesFromAPI = res.data.levels[mode.level].tiles;
                setMoves(tilesFromAPI.length * 3);
                setPictureTiles(shuffle(tilesFromAPI));
                setSortedTiles(res.data.levels[mode.level].tiles.sort((a,b) => {
                    if(a.y === b.y){
                        return a.x-b.x;
                    }
                    return a.y-b.y;
                }))
            })
            .catch( err => console.log(err))
    }, [reset,mode])

    // useEffect(() => {
    //     if(solved) setSolved(solved);
    // },[solved]);

    //SHUFFLE FUNCTION FOR RANDOMIZING TILE ORDER
    const shuffle = (a) => {
        const b = a.slice();

        for (let i = b.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [b[i], b[j]] = [b[j], b[i]];
        }
        
        return b;
    }

    //HANDLING SWAP
    const handleSwap = (index) => {
        //if a tile has already been selected, then proceed to swap them
        if(selectedTileID !== null){
            swap(selectedTileID,index);
            //check if the last made move successfully completed the board
            if(checkIfSolved(pictureTiles,sortedTiles)) setSolved(true);
        } else { //otherwise set the selected tile index as the 1st selected tile
            setSelectedTileID(index);
        }
    }

    //CHECK IF PUZZLE HAS BEEN SOLVED
    const checkIfSolved = (a,b) => {
        //check if the x and y coordinates and the url all match the sorted version, if so then complete
        for(let i=0; i < a.length; i++){
            //probably can optimize this to have a count and only check if the two that are swapped are in the right place. If count == length then solved => true
            if(a[i].x !== b[i].x || a[i].y !== b[i].y || a[i].url !== b[i].url) return false;
        }
        return true;
    }

    //SWAP 2 TILES
    const swap = (index1,index2) => {
        let newTiles = [...pictureTiles];
        [newTiles[index1],newTiles[index2]] = [newTiles[index2],newTiles[index1]];
        setPictureTiles(newTiles);
        setSelectedTileID(null);
        setMoves(moves - 1);
    }

    //RESET FUNCTION
    const handleReset = () => {
        setSolved(false);
        setReset(!reset);
    }

    //HANDLE MODE SELECTION
    const handleChange = (e) => {
        setMode(modeOptions[e.target.value]);
    }

  return (
    <>
        <select onChange={handleChange}>
            {
                modeOptions.map((option,index) => (
                    <option key={index} value={index}>{option.name}</option>
                ))
            }
        </select>
        <p>You have <span style={{color:'red'}}>{moves}</span> available moves left.</p>
        <div className="tileContainer" style={{
            height: data.height,
            width: data.width,
            border: solved && moves >= 0 ? '5px solid green' : 'none',
            }}>
            {
                pictureTiles.map((tile,index) => {
                    return(
                        <div key={index} onClick={() => handleSwap(index)} className="picTile" style={{
                            opacity: selectedTileID === index ? 0.5 : 1,
                            }}>
                            <img src={tile.url} alt="Tile" />
                        </div>
                    )
                })
            }
        </div>
        {
            solved && moves > 0?
            <div>
                <p id="winFont">You Win!</p>
                <button onClick={() => handleReset()}>Reset</button>
            </div> : !moves ?
                <>
                    <p id="loseFont">You Lost!</p>
                    <button onClick={() => handleReset()}>Reset</button>
                </> :
            <p>Keep Trying</p>
        }
    </>
  )
}

export default PicTiles