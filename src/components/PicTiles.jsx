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

    //RETRIEVE TILE DATA
    useEffect(() => {
        axios.get(`https://www.rijksmuseum.nl/api/nl/collection/SK-C-5/tiles?key=${key}`)
            .then( res => {
                console.log(res.data.levels);
                setData(res.data.levels[1]);
                setPictureTiles(shuffle(res.data.levels[1].tiles));
                setSortedTiles(res.data.levels[1].tiles.sort((a,b) => {
                    if(a.x === b.x){
                        return a.y-b.y;
                    }
                    return a.x-b.x;
                }))
            })
            .catch( err => console.log(err))
    }, [])

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
            if(checkIfSolved(pictureTiles,data.levels[1].tiles)) setSolved(true);
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
            console.log(a[i],b[i])
            if(!(a[i].x === b[i].x) || !(a[i].y === b[i].y) || !(a[i].url === b[i].url)) return false;
        }
        return true;
    }

    //SWAP 2 TILES
    const swap = (index1,index2) => {
        let newTiles = [...pictureTiles];
        [newTiles[index1],newTiles[index2]] = [newTiles[index2],newTiles[index1]];
        setPictureTiles(newTiles);
    }

  return (
    <>
        <div className="tileContainer" style={{
            height: data.height,
            width: data.width,
            borderColor: solved ? 'green' : 'red',
            }}>
            {
                pictureTiles.map((tile,index) => {
                    return(
                        <div key={index} onClick={() => handleSwap(index)} className="picTile" style={{
                            opacity: selectedTileID === index ? 0.5 : 1,
                            }}>
                            <img src={tile.url} alt="Shuffled Tile" />
                        </div>
                    )
                })
            }
        </div>
    </>
  )
}

export default PicTiles