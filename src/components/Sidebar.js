import React from 'react'

export const Sidebar = (props) => {

    const linkColor = document.querySelectorAll('.nav_link')

    function colorLink() {
        if (linkColor) {
            linkColor.forEach(l => {
                l.classList.add('active')
                console.log(l);
        })
        this.classList.remove('active')

    }
}
linkColor.forEach(l => l.addEventListener('click', colorLink))

return (
    <>
        {/* <header className="header" id="header">
                <div className="header_toggle"> <i className='bx bx-menu' id="header-toggle"></i> </div>
                <div className="header_img"> <img src="https://i.imgur.com/hczKIze.jpg" alt="" /> </div>
            </header> */}
        <div className="l-navbar" id="nav-bar">
            <nav className="nav">
                <div> <a href="#" className="nav_logo"> <i className='bx bx-layer nav_logo-icon'></i> <span className="nav_logo-name">iMusicPlay</span> </a>
                    <div className="nav_list">
                        <a href="#" className="nav_link ">
                            <i className='bx bx-grid-alt nav_icon'></i>
                            <span className="nav_name">Trending</span>
                        </a>
                        <a href="#" className="nav_link">
                            <i className='bx bx-user nav_icon'></i>
                            <span className="nav_name">RecntlyPlayed</span>
                        </a>
                        <a href="#" className="nav_link">
                            <i className='bx bx-message-square-detail nav_icon'></i>
                            <span className="nav_name">Popular</span>
                        </a>
                        <a href="#" className="nav_link">
                            <i className='bx bx-bookmark nav_icon'></i>
                            <span className="nav_name">Playlists</span>
                        </a>
                        <a href="#" className="nav_link">
                            <i className='bx bx-folder nav_icon'></i>
                            <span className="nav_name">Favoraties</span>
                        </a>
                        <a href="#" className="nav_link">
                            <i className='bx bx-bar-chart-alt-2 nav_icon'></i>
                            <span className="nav_name">Top plays</span>
                        </a>
                    </div>
                </div> <a href="#" className="nav_link"> <i className='bx bx-log-out nav_icon'></i> <span className="nav_name">SignOut</span> </a>
            </nav>
        </div>
    </>
)
}
