import React from 'react'
import { Link } from 'react-router-dom'
import Marquee from "react-fast-marquee";

const Header = () => {
    const image ="https://openclipart.org/download/36241/home3-icon.svg"
    return (
        <>
            <nav class="navbar navbar-expand-lg navbar-light sticky-sm-top"  >
                <div className='container-fluid bg-dark p-3' >
                <img className='ms-4 mb-1' alt='house' src={image} height={50}/>                
                    <Link class="navbar-brand text-light ms-3 mt-2" to="/"><h5>House market place</h5></Link>
                    <button class="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>  
                    <sapn className="border border-primary pt-1" style={{ marginLeft: "5%",width:"600px",
                        height: "50px", color: "YEllow", wordSpacing:"30px"}}>
                        <Marquee text="swetha"><h3><strong>WELCOME  SK  HOME</strong></h3> </Marquee>
                    </sapn>
                    <div class="collapse navbar-collapse me-4" id="navbarSupportedContent">
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item active">
                                <Link class="nav-link  text-light" to="/">Explore </Link>
                            </li>
                            <li class="nav-item">
                                <Link class="nav-link  text-light" to="/offers">Offers</Link>
                            </li>
                            <li class="nav-item">
                                <Link class="nav-link  text-light" to="/profile">Profile</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}


export default Header