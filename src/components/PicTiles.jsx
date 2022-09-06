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

    useEffect(() => {
        axios.get(`https://www.rijksmuseum.nl/api/nl/collection/SK-C-5/tiles?key=${key}`)
            .then( res => {
                console.log(res.data.levels);
                setData(res.data.levels[1]);
                setPictureTiles(shuffle(res.data.levels[1].tiles));
                setSortedTiles(pictureTiles.sort((a,b) => {
                    if(a.x === b.x){
                        return a.y-b.y;
                    }
                    return a.x-b.x;
                }))
            })
            .catch( err => console.log(err))
    }, [])

    const shuffle = (a) => {
        const b = a.slice();

        for (let i = b.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [b[i], b[j]] = [b[j], b[i]];
        }
        
        return b;
    }

    const handleSwap = (id) => {

    }

    const checkIfSorted = () => {
        
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
                        <div key={index} className="picTile" style={{
                            // backgroundImage: `url(${tile.url})`,
                            // height: data.height/pictureTiles.length,
                            // width: data.width/pictureTiles.length,
                            }}>
                            <img src={tile.url} alt="Shuffled Image" />
                        </div>
                    )
                })
            }
        </div>
    </>
  )
}

export default PicTiles