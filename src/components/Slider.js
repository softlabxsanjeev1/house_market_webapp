import React from 'react'
import { useState, useEffect } from 'react'
import { db } from '../firebase.config'
import { collection,getDoc, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

import SwipeCore, { EffectCoverflow, Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import Spinner from './Spinner'

// configure
SwipeCore.use([EffectCoverflow, Pagination])

const Slider = () => {
    const [listings,setListings] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const userPic = 'https://openclipart.org/download/288355/user-spy.svg';

    useEffect(() => {
        const fetchListings = async () => {
            const listingRef = collection(db,'listings')
            const q = query(listingRef,orderBy('timestamp','desc', limit(5)))
            const querySnap = await getDocs(q)
            let listings = []
            querySnap.forEach(doc => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })
            setListings(listings)
            setLoading(false)
        }
        fetchListings()
       console.log(listings === null ? "loading" : listings);
       // eslint-disable-next-line
    },[])

    if(loading) {
        return <Spinner/>
    }
  return (
    <>
          <div className='card-header border border-primary rounded mb-4' style={{width:"680px",marginLeft:"200px"}}>
              {listings === null ? (
                  <Spinner />
              ) : (
                  <Swiper
                      effect={"coverflow"}
                      grabCursor={true}
                      centeredSlides={true}
                      slidesPerView={1}
                      coverflowEffect={{
                          rotate: 50,
                          stretch: 0,
                          depth: 100,
                          modifier: 1,
                          slideShadows: true,
                      }}
                      pagination={true}
                      className="mySwipe"
                    >
                      {listings.map(({data,id}) => (
                          <SwiperSlide
                          key={id}
                          onClick={() => {
                            navigate(`/category/${data.type}/${id}`);
                          }}                          
                          >
                          <h5 className='bg-info text-light p-2 ' style={{width:"710px"}}>
                                  <img src={userPic} alt='user-pic' height={35} width={35}/>
                            <span className='ms-2'>Owner : {data.name}</span>
                          </h5>
                              <img
                            //   error not read data from url   {src={data.imageUrls[0]}}  => not working
                                  src={data.imageUrls[0]}
                                  height={400}
                                  width={700}
                                  alt={data.name}
                              />
                              <button className='btn'>Swipe Right -></button>
                          
                          </SwiperSlide>
                      ))}
                  </Swiper>
              )}
            </div>
    </>
  )
}

export default Slider