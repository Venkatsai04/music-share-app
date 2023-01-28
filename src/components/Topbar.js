import React from 'react'

const Topbar = () => {

    const Mystyle = {
        fontWeight: "bold",
        fontSize: "25px"
    }
    
    const newStyle ={
        WebkitTextStroke: "1px white",
        color: "black",
        fontSize: "30px"
        
    }



    return (
        <>
            <figure className="text-center my-4 " >
                <blockquote className="blockquote bold">
                    <p style={Mystyle}><b style={newStyle}>Trending </b>songs this week, played by 10m+ people</p>
                </blockquote>
                <figcaption className="blockquote-footer">
                    Some famous songs in QUEUE
                </figcaption>
            </figure>
        </>
    )
}

export default Topbar