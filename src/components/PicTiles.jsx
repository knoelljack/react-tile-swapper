import React, { useEffect, useState } from "react";
import axios from 'axios';
import './PicTiles.css'

const key = process.env.REACT_APP_PIC_API_KEY;

const PicTiles = () => {

    const [data,setData] = useState({});
    const [pictureTiles,setPictureTiles] = useState([]);
    const [sortedTiles,setSortedTiles] = useState([]);
    const [tileIsSelected,setTileIsSelected] = useState(false);
    const [selectedTileID,setSelectedTileID] = useState(null);
    const [solved,setSolved] = useState(false);
    const [moves,setMoves] = useState(0);
    const [reset,setReset] = useState(false);

    //RETRIEVE TILE DATA
    useEffect(() => {
        axios.get(`https://www.rijksmuseum.nl/api/nl/collection/SK-C-5/tiles?key=${key}`)
            .then( res => {
                console.log(res.data.levels);
                setData(res.data.levels[1]);
                let tilesFromAPI = res.data.levels[1].tiles;
                setMoves(tilesFromAPI.length * 3);
                // let tilesWithIDs = [];
                // for(let i=0; i<tilesFromAPI.length; i++){
                //     let newTile = {...tilesFromAPI[i],id:i};
                //     tilesWithIDs.push(newTile);
                // }
                setPictureTiles(shuffle(tilesFromAPI));
                setSortedTiles(res.data.levels[1].tiles.sort((a,b) => {
                    if(a.y === b.y){
                        return a.x-b.x;
                    }
                    return a.y-b.y;
                }))
                // setSortedTiles(tilesFromAPI);
            })
            .catch( err => console.log(err))
    }, [reset])

    //SHUFFLE FUNCTION FOR RANDOMIZING TILE ORDER
    const shuffle = (a) => {
        const b = a.slice();

        for (let i = b.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [b[i], b[j]] = [b[j], b[i]];
        }
        
        return b;
    }

    //HANDLING SWAP
    const handleSwap = (index) => {
        //if a tile has already been selected, then proceed to swap them
        if(tileIsSelected){
            swap(selectedTileID,index);
            //check if the last made move successfully completed the board
            if(checkIfSolved(pictureTiles,sortedTiles)) setSolved(true);
            console.log(solved)
        } else { //otherwise set the selected tile index as the 1st selected tile
            setTileIsSelected(true);
            setSelectedTileID(index);
        }
    }

    //CHECK IF PUZZLE HAS BEEN SOLVED
    const checkIfSolved = (a,b) => {
        console.log(a,b)
        for(let i=0; i < a.length; i++){
            if(!(a[i].x === b[i].x) || !(a[i].y === b[i].y) || !(a[i].url === b[i].url)) return false;
        }
        return true;
    }

    //SWAP 2 TILES
    const swap = (index1,index2) => {
        // console.log(index1,index2)
        let newTiles = [...pictureTiles];
        [newTiles[index1],newTiles[index2]] = [newTiles[index2],newTiles[index1]];
        setPictureTiles(newTiles);
        setSelectedTileID(null);
        setTileIsSelected(false);
        setMoves(moves - 1);
    }

    //RESET FUNCTION
    const handleReset = () => {
        // setPictureTiles([]);
        setSolved(false);
        // setSortedTiles([]);
        setTileIsSelected(null);
        setReset(!reset);
    }

  return (
    <>
        <p>You have <span style={{color:'red'}}>{moves}</span> available moves left.</p>
        <div className="tileContainer" style={{
            height: data.height,
            width: data.width,
            border: solved && moves >= 0 ? '5px solid green' : 'none',
            }}>
            {
                pictureTiles.map((tile,index) => {
                    // console.log(tile.url,tile.x,tile.y,index)
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