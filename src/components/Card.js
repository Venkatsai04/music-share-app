import React from 'react'

const Card = (props) => {
  // 'X-RapidAPI-Key': '321928abdbmsha29e35f53a8bc3bp11de77jsncc1e01d407a1',
  // fetch('https://shazam.p.rapidapi.com/shazam-events/list?artistId=73406786&l=en-US&from=2022-12-31&limit=50&offset=0', options)
  // 'X-RapidAPI-Host': 'shazam.p.rapidapi.com'

 
  
    
  const mystyle = {
    card: {
      display: "flex",
      width: "200px",
      height: "200px",
      alignContent: " center",
      justifyContent: "center",
    },
    img:{
      margin: "auto",
      borderRadius: "50%"
    },
    head:{
      margin: "auto"
    },
    h2:{
      fontSize: "18px",
      color: "black"
    },
    btn:{
      margin: "2px",
      margin: "10px",
      padding:" 2px 20px",
      border: "none",
      borderRadius: "20px"
    }
  }

return (
  <>
    <div className='card' style={mystyle.card} >
      <img style={mystyle.img} src={props.bg} width={"100px"} height={"100px"} alt="img"/>
      <div  style={mystyle.head} className='profieHead'>
        <h2 style={mystyle.h2}>{props.songName}</h2>
        <audio src=''/>
        <button style={mystyle.btn}>Play</button>
      </div>
    </div>

  </>
)
}

export default Card