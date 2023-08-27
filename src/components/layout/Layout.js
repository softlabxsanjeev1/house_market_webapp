import React from 'react'
import Header from './Header'
// import Footer from './Footer'

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <main style={{ maxheight: "80vh" }}>
                {children}
            </main>
            {/* <Footer /> */}
        </>
    )
}

export default Layout