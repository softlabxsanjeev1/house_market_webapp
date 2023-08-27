import React from 'react'
import Layout from '../components/layout/Layout'
import { useNavigate } from 'react-router-dom'
import Slider from '../components/Slider'

const HomePage = () => {
    const navigate = useNavigate()
    const img1 =
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    const img2 =
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80"
    return (
        <Layout>
            <div className='container mt-3'>
                <h2 className='pt-4 pb-4' style={{  backgroundColor:"#ACE1AF" , paddingLeft:"400px"}}>Recent properties</h2>
            <Slider/>
                <div className='row'>
                    <h1>Category</h1>
                    <div className='col-md-5'>
                        <div className='Imagecontainer'>
                            <img src={img1} alt='Rent' style={{ width: "100%" }} />
                            <button className='btn'
                                onClick={() => navigate('/category/rent')}>To Rent</button>
                        </div>
                    </div>
                    <div className='col-md-5'>
                        <div className='Imagecontainer'>
                            <img src={img2} alt='Rent' style={{ width: "100%" }} />
                            <button className='btn'
                                onClick={() => navigate('/category/sale')}>To Sale</button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default HomePage