import React from 'react'
import Card from './Card.js'
import { useState, useEffect } from 'react'

const Cards = () => {

  const [Song, setSong] = useState([])

  async function getResponse() {
    const response = await fetch(
      'https://shazam.p.rapidapi.com/songs/list-artist-top-tracks?id=40008598&locale=en-US',
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '321928abdbmsha29e35f53a8bc3bp11de77jsncc1e01d407a1',
          'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
        }
      }
    );
    try {
      let data = await response.json();
      console.log(data.tracks);
      setSong(data.tracks)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getResponse()
  }, [])



  const mystyle = {
    position: "relative",
    width: "calc(100% - 100px)",
    left: "108px",
    height: "maxCcontent",
    display: "grid",
    gridTemplateColumns: "auto auto auto auto auto auto",
    rowGap: " 50px",
    justifyItems: "center"
  }

  return (

    <div style={mystyle}>
      {
        Song?.length > 0
          ?
          (
            Song.map((song)=>(
              (
              <Card songName={song.title} bg={song.share.avatar} url={song.url}/>
              )
            ))
          )
          : (
            <div>
              no songs found
            </div>
          )
      }
    </div>

  )
}

export default Cards